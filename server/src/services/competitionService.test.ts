import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { Competition, User, Judge, Registration, Submission, Winner } from '../models/index.js';
import { CompetitionService } from './competitionService.js';
import { AppError } from '../utils/AppError.js';

describe('CompetitionService — Direct Concurrency, Duplicate & Rollback Tests', () => {
  let testJudgeId: string;

  before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDatabase();

    await Promise.all([
      Competition.deleteMany({}),
      User.deleteMany({}),
      Judge.deleteMany({}),
      Registration.deleteMany({}),
      Submission.deleteMany({}),
      Winner.deleteMany({}),
    ]);

    const judge = await Judge.create({
      name: 'Service Test Judge',
      designation: 'Master Dancer',
      experienceYears: '15 Years',
      avatarUrl: 'https://example.com/judge.jpg',
      introVideoUrl: 'https://example.com/judge.mp4',
    });
    testJudgeId = judge._id.toString();
  });

  after(async () => {
    await disconnectDatabase();
  });

  // 1. CAPACITY CONCURRENCY TEST (DIRECT SERVICE ENGINE)
  it('Capacity Concurrency: 10 distinct users competing for 1 remaining spot -> Exactly 1 succeeds, 9 fail with SOLD_OUT', async () => {
    const now = new Date();
    const comp = await Competition.create({
      title: 'Direct Capacity Concurrency Race',
      category: 'Dance',
      tags: ['Concurrency'],
      prizePool: 1000,
      entryFee: 50,
      totalSpots: 5,
      bookedSpots: 4, // Exactly 1 spot remaining!
      judgeId: new mongoose.Types.ObjectId(testJudgeId),
      dates: {
        submissionStarts: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        registerBefore: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        submissionEnds: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        resultDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      },
      details: { about: 'Direct concurrency test', judgingParameters: [], rulesAndEligibility: [] },
    });

    const users = await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        User.create({
          name: `Direct User ${i + 1}`,
          email: `direct.race.user.${Date.now()}.${i}@example.com`,
        })
      )
    );

    // Execute 10 concurrent registrations directly against service transaction engine
    const results = await Promise.allSettled(
      users.map((user) => CompetitionService.registerUser(comp._id.toString(), user._id.toString()))
    );

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];

    assert.strictEqual(
      fulfilled.length,
      1,
      `Expected exactly 1 successful registration, but got ${fulfilled.length}`
    );

    assert.strictEqual(
      rejected.length,
      9,
      `Expected exactly 9 rejected registration attempts, but got ${rejected.length}`
    );

    // Verify all 9 failures are actual capacity/sold-out business rejections (HTTP 410 / 409)
    for (const rej of rejected) {
      const err = rej.reason as AppError;
      assert.ok(
        err.statusCode === 410 || err.statusCode === 409,
        `Expected error status 410 or 409, but got ${err.statusCode} (${err.message})`
      );
    }

    // Verify DB integrity
    const updatedComp = await Competition.findById(comp._id);
    assert.strictEqual(
      updatedComp?.bookedSpots,
      5,
      `Booked spots must be exactly 5 (totalSpots capacity limit), but was ${updatedComp?.bookedSpots}`
    );

    const regCount = await Registration.countDocuments({ competitionId: comp._id });
    assert.strictEqual(regCount, 1, 'Exactly 1 new Registration document must exist in DB');
  });

  // 2. DUPLICATE REGISTRATION RACE CONCURRENCY TEST
  it('Duplicate Registration Race: Same user registering 10 times concurrently -> Exactly 1 succeeds, 9 fail with ALREADY_REGISTERED', async () => {
    const now = new Date();
    const comp = await Competition.create({
      title: 'Duplicate Registration Race Competition',
      category: 'Dance',
      tags: ['DuplicateRace'],
      prizePool: 1000,
      entryFee: 50,
      totalSpots: 10,
      bookedSpots: 0,
      judgeId: new mongoose.Types.ObjectId(testJudgeId),
      dates: {
        submissionStarts: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        registerBefore: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        submissionEnds: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        resultDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      },
      details: { about: 'Duplicate race', judgingParameters: [], rulesAndEligibility: [] },
    });

    const user = await User.create({
      name: 'Same User Duplicate Tester',
      email: `same.user.${Date.now()}@example.com`,
    });

    // Execute 10 concurrent requests for the SAME user
    const results = await Promise.allSettled(
      Array.from({ length: 10 }).map(() =>
        CompetitionService.registerUser(comp._id.toString(), user._id.toString())
      )
    );

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];

    assert.strictEqual(fulfilled.length, 1, 'Exactly 1 registration must succeed for the same user');
    assert.strictEqual(rejected.length, 9, 'Exactly 9 registration attempts must be rejected');

    for (const rej of rejected) {
      const err = rej.reason as AppError;
      assert.strictEqual(
        err.statusCode,
        409,
        `Expected HTTP 409 for duplicate user registration, but got ${err.statusCode}`
      );
    }

    const updatedComp = await Competition.findById(comp._id);
    assert.strictEqual(updatedComp?.bookedSpots, 1, 'Booked spots must increment by exactly 1');

    const regCount = await Registration.countDocuments({ competitionId: comp._id, userId: user._id });
    assert.strictEqual(regCount, 1, 'Exactly 1 Registration record must exist in DB for this user');
  });

  // 3. TRANSACTION ROLLBACK TEST
  it('Transaction Rollback: If user registration fails post-reservation, transaction aborts and bookedSpots reverts', async () => {
    const now = new Date();
    const comp = await Competition.create({
      title: 'Rollback Test Competition',
      category: 'Dance',
      tags: ['Rollback'],
      prizePool: 500,
      entryFee: 10,
      totalSpots: 5,
      bookedSpots: 2,
      judgeId: new mongoose.Types.ObjectId(testJudgeId),
      dates: {
        submissionStarts: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        registerBefore: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        submissionEnds: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        resultDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      },
      details: { about: 'Rollback test', judgingParameters: [], rulesAndEligibility: [] },
    });

    const fakeUserId = new mongoose.Types.ObjectId().toString(); // User does not exist in User collection!

    // Call registerUser with non-existent user ID
    await assert.rejects(
      async () => {
        await CompetitionService.registerUser(comp._id.toString(), fakeUserId);
      },
      (err: AppError) => {
        assert.strictEqual(err.statusCode, 404);
        assert.strictEqual(err.message, 'User not found');
        return true;
      }
    );

    // Verify database state remained completely unchanged
    const finalComp = await Competition.findById(comp._id);
    assert.strictEqual(finalComp?.bookedSpots, 2, 'Booked spots must remain 2 after transaction rollback');

    const regCount = await Registration.countDocuments({ competitionId: comp._id });
    assert.strictEqual(regCount, 0, 'No registration documents should be created');
  });
});
