process.env.NODE_ENV = 'test';

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import mongoose from 'mongoose';
import app from '../server.js';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { Competition, User, Judge, Registration, Submission, Winner } from '../models/index.js';

let server: http.Server;
let baseUrl: string;

const makeRequest = (
  method: string,
  path: string,
  headers: Record<string, string> = {},
  body?: any
): Promise<{ status: number; body: any }> => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const postData = body ? JSON.stringify(body) : '';

    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (postData) {
      reqHeaders['Content-Length'] = Buffer.byteLength(postData).toString();
    }

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let responseText = '';
        res.on('data', (chunk) => {
          responseText += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = responseText ? JSON.parse(responseText) : {};
            resolve({ status: res.statusCode || 500, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode || 500, body: { raw: responseText } });
          }
        });
      }
    );

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

describe('Competition API & Concurrency Integration Tests', () => {
  let testJudgeId: string;
  let testUserId: string;
  let testCompId: string;

  before(async () => {
    await connectDatabase();

    await Promise.all([
      Competition.deleteMany({}),
      User.deleteMany({}),
      Judge.deleteMany({}),
      Registration.deleteMany({}),
      Submission.deleteMany({}),
      Winner.deleteMany({}),
    ]);

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as any;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });

    const judge = await Judge.create({
      name: 'Test Judge',
      designation: 'Test Dancer',
      experienceYears: '10 Years',
      avatarUrl: 'https://example.com/judge.jpg',
      introVideoUrl: 'https://example.com/judge.mp4',
    });
    testJudgeId = judge._id.toString();

    const user = await User.create({
      name: 'Primary Test User',
      email: 'primary.test@example.com',
    });
    testUserId = user._id.toString();

    const now = new Date();
    const comp = await Competition.create({
      title: 'Active Test Competition',
      category: 'Dance',
      tags: ['Test'],
      certificateProvided: true,
      prizePool: 1000,
      entryFee: 50,
      totalSpots: 10,
      bookedSpots: 0,
      judgeId: judge._id,
      dates: {
        submissionStarts: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        registerBefore: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        submissionEnds: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        resultDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      },
      details: {
        about: 'Test About',
        judgingParameters: ['Technique'],
        rulesAndEligibility: ['Rule 1'],
      },
      rewards: [{ position: 1, title: '1st Winner', amount: 1000 }],
    });
    testCompId = comp._id.toString();
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDatabase();
  });

  // A. GET COMPETITION
  describe('GET /api/v1/competitions/:id', () => {
    it('should return 400 for invalid MongoDB ObjectId format', async () => {
      const res = await makeRequest('GET', '/api/v1/competitions/invalid-id-123');
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('should return 404 for non-existent competition ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await makeRequest('GET', `/api/v1/competitions/${fakeId}`);
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.body.success, false);
    });

    it('should return 200 with populated competition details and userState', async () => {
      const res = await makeRequest(
        'GET',
        `/api/v1/competitions/${testCompId}`,
        { 'x-user-id': testUserId }
      );
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.competition.title, 'Active Test Competition');
      assert.strictEqual(res.body.data.competition.remainingSpots, 10);
      assert.strictEqual(res.body.data.userState.isRegistered, false);
      assert.strictEqual(res.body.data.lifecycle.state, 'SUBMISSION_OPEN');
    });
  });

  // B. REGISTRATION API
  describe('POST /api/v1/competitions/:id/register', () => {
    it('should return 401 if x-user-id header is missing', async () => {
      const res = await makeRequest('POST', `/api/v1/competitions/${testCompId}/register`, {}, {});
      assert.strictEqual(res.status, 401);
    });

    it('should successfully register an unregistered user', async () => {
      const res = await makeRequest(
        'POST',
        `/api/v1/competitions/${testCompId}/register`,
        { 'x-user-id': testUserId },
        { paymentToken: 'pay_mock_123' }
      );
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.bookedSpots, 1);
      assert.strictEqual(res.body.data.remainingSpots, 9);

      const updatedComp = await Competition.findById(testCompId);
      assert.strictEqual(updatedComp?.bookedSpots, 1);
    });

    it('should return 409 Conflict if user tries to register twice', async () => {
      const res = await makeRequest(
        'POST',
        `/api/v1/competitions/${testCompId}/register`,
        { 'x-user-id': testUserId },
        { paymentToken: 'pay_mock_123' }
      );
      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
    });

    it('should return 400 Bad Request when registration deadline has passed', async () => {
      const now = new Date();
      const expiredComp = await Competition.create({
        title: 'Expired Competition',
        category: 'Dance',
        tags: ['Test'],
        prizePool: 500,
        entryFee: 10,
        totalSpots: 10,
        bookedSpots: 0,
        judgeId: new mongoose.Types.ObjectId(testJudgeId),
        dates: {
          submissionStarts: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          registerBefore: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          submissionEnds: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          resultDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        },
        details: { about: 'Expired', judgingParameters: [], rulesAndEligibility: [] },
      });

      const newUser = await User.create({ name: 'Expired Test User', email: 'expired@example.com' });

      const res = await makeRequest(
        'POST',
        `/api/v1/competitions/${expiredComp._id}/register`,
        { 'x-user-id': newUser._id.toString() }
      );
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });
  });

  // C. SUBMISSION API
  describe('POST /api/v1/competitions/:id/submit', () => {
    it('should return 403 Forbidden for an unregistered user', async () => {
      const unregisteredUser = await User.create({ name: 'Unregistered User', email: 'unreg@example.com' });
      const res = await makeRequest(
        'POST',
        `/api/v1/competitions/${testCompId}/submit`,
        { 'x-user-id': unregisteredUser._id.toString() },
        { mediaUrl: 'https://example.com/video.mp4', caption: 'My submission' }
      );
      assert.strictEqual(res.status, 403);
    });

    it('should successfully upload submission for registered user during submission window', async () => {
      const res = await makeRequest(
        'POST',
        `/api/v1/competitions/${testCompId}/submit`,
        { 'x-user-id': testUserId },
        { mediaUrl: 'https://example.com/registered_video.mp4', caption: 'Official submission' }
      );
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.mediaUrl, 'https://example.com/registered_video.mp4');
    });

    it('should return 409 Conflict if user submits twice', async () => {
      const res = await makeRequest(
        'POST',
        `/api/v1/competitions/${testCompId}/submit`,
        { 'x-user-id': testUserId },
        { mediaUrl: 'https://example.com/duplicate_video.mp4' }
      );
      assert.strictEqual(res.status, 409);
    });
  });

  // D. CRITICAL CONCURRENCY TEST
  describe('CRITICAL CONCURRENCY TEST — 10 Concurrent Requests for 1 Remaining Spot', () => {
    it('should allow EXACTLY ONE registration to succeed and reject all 9 others', async () => {
      const now = new Date();
      const concurrencyComp = await Competition.create({
        title: 'High Concurrency Race Competition',
        category: 'Dance',
        tags: ['ConcurrencyTest'],
        prizePool: 2000,
        entryFee: 100,
        totalSpots: 5,
        bookedSpots: 4, // 1 SPOT LEFT
        judgeId: new mongoose.Types.ObjectId(testJudgeId),
        dates: {
          submissionStarts: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          registerBefore: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
          submissionEnds: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
          resultDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        },
        details: { about: 'Race test', judgingParameters: [], rulesAndEligibility: [] },
      });

      const users = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
          User.create({
            name: `Concurrency User ${i + 1}`,
            email: `race.user.${Date.now()}.${i}@example.com`,
          })
        )
      );

      const registrationPromises = users.map((user) =>
        makeRequest(
          'POST',
          `/api/v1/competitions/${concurrencyComp._id}/register`,
          { 'x-user-id': user._id.toString() },
          { paymentToken: 'pay_race_test' }
        )
      );

      const results = await Promise.all(registrationPromises);

      const successResults = results.filter((r) => r.status === 201);
      const failedResults = results.filter((r) => r.status === 410 || r.status === 409 || r.status === 429);

      assert.strictEqual(
        successResults.length,
        1,
        `Expected exactly 1 success out of 10 concurrent requests, but got ${successResults.length}`
      );

      assert.strictEqual(
        failedResults.length,
        9,
        `Expected exactly 9 failed requests, but got ${failedResults.length}`
      );

      const finalComp = await Competition.findById(concurrencyComp._id);
      assert.strictEqual(
        finalComp?.bookedSpots,
        5,
        `Booked spots must be exactly 5 (totalSpots limit), but was ${finalComp?.bookedSpots}`
      );

      const regCount = await Registration.countDocuments({ competitionId: concurrencyComp._id });
      assert.strictEqual(regCount, 1, 'Exactly one new Registration document must exist in database');
    });
  });
});
