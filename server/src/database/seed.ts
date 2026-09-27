import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { Competition, User, Judge, Registration, Winner, RegistrationStatus, PaymentStatus } from '../models/index.js';

// Deterministic ObjectIds matching client/src/constants/config.ts
export const DEMO_JUDGE_ID = new mongoose.Types.ObjectId('6ab8ffc731f29eaaf5047da7');
export const DEMO_USER_ID = new mongoose.Types.ObjectId('6ab8ffc731f29eaaf5047da8');
export const DEMO_BOOKED_USER_ID = new mongoose.Types.ObjectId('6ab8ffc731f29eaaf5047da9');
export const DEMO_COMPETITION_ID = new mongoose.Types.ObjectId('6ab8ffc731f29eaaf5047daa');

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding process...');

    if (mongoose.connection.readyState !== 1) {
      const connected = await connectDatabase();
      if (!connected) {
        throw new Error('Database connection failed during seeding');
      }
    }

    // 1. Seed or Update Judge with deterministic ID
    const judge = await Judge.findOneAndUpdate(
      { _id: DEMO_JUDGE_ID },
      {
        _id: DEMO_JUDGE_ID,
        name: 'Manju Dubey',
        designation: 'Professional Kathak Dancer',
        experienceYears: '12+ Years of Experience',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Judge seeded: ${judge.name} (${judge._id})`);

    // 2. Seed Demo User with deterministic ID
    const demoUser = await User.findOneAndUpdate(
      { _id: DEMO_USER_ID },
      {
        _id: DEMO_USER_ID,
        name: 'Demo Participant',
        email: 'demo.participant@feedants.local',
        phone: '+919876543210',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        referralCode: 'demouser123',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Demo User seeded: ${demoUser.name} (${demoUser._id})`);

    // 3. Seed Registered Participant (Accountable for booked spot)
    const registeredUser = await User.findOneAndUpdate(
      { _id: DEMO_BOOKED_USER_ID },
      {
        _id: DEMO_BOOKED_USER_ID,
        name: 'Aarav Mehta',
        email: 'aarav.mehta@feedants.local',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 4. Calculate Demo Dates based on DEMO_DATE_OFFSET_DAYS (defaults to 7 days in future so registration is open)
    const dateOffsetDays = parseInt(process.env.DEMO_DATE_OFFSET_DAYS || '7', 10);

    let registerBefore = new Date('2026-08-10T23:50:00.000Z');
    let submissionStarts = new Date('2026-08-06T04:00:00.000Z');
    let submissionEnds = new Date('2026-08-30T23:55:00.000Z');
    let resultDate = new Date('2026-09-01T23:50:00.000Z');

    if (dateOffsetDays > 0) {
      const now = new Date();
      registerBefore = new Date(now.getTime() + dateOffsetDays * 24 * 60 * 60 * 1000);
      submissionStarts = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      submissionEnds = new Date(now.getTime() + (dateOffsetDays + 10) * 24 * 60 * 60 * 1000);
      resultDate = new Date(now.getTime() + (dateOffsetDays + 12) * 24 * 60 * 60 * 1000);
    }

    // Preserve existing bookedSpots if competition already exists in persistent DB
    const existingComp = await Competition.findById(DEMO_COMPETITION_ID);
    const initialBookedSpots = existingComp ? existingComp.bookedSpots : 1;

    // 5. Seed Competition with deterministic ID
    const competition = await Competition.findOneAndUpdate(
      { _id: DEMO_COMPETITION_ID },
      {
        _id: DEMO_COMPETITION_ID,
        title: 'Feedants Classical Dance',
        category: 'Dance',
        tags: ['Dance', 'Multi-Win'],
        certificateProvided: true,
        prizePool: 1500,
        entryFee: 99,
        totalSpots: 20,
        bookedSpots: initialBookedSpots,
        judgeId: judge._id,
        dates: {
          registerBefore,
          submissionStarts,
          submissionEnds,
          resultDate,
        },
        details: {
          about:
            'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
          judgingParameters: [
            'Rhythm & Synchronization (Tala & Laya)',
            'Facial Expressions & Storytelling (Abhinaya)',
            'Technical Technique & Form',
            'Costume & Overall Stage Presence',
          ],
          rulesAndEligibility: [
            'Open for all age groups.',
            'Participate from anywhere and showcase your talent.',
            'Express your passion through traditional dance.',
            'Only contributions from paid participants will be considered for judging.',
            'Submissions must be original solo/group recordings under 3 minutes.',
          ],
        },
        rewards: [
          { position: 1, title: '1st Winner', amount: 550 },
          { position: 2, title: '2nd Winner', amount: 300 },
          { position: 3, title: '3rd Winner', amount: 240 },
          { position: 4, title: '4th Winner', amount: 200 },
          { position: 5, title: '5th Winner', amount: 130 },
          { position: 6, title: '6th Winner', amount: 80 },
        ],
        referralConfig: {
          enabled: true,
          rewardPerSignup: 10,
          defaultCode: 'referral123',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Competition seeded: ${competition.title} (${competition._id})`);

    // 6. Seed Initial Registration for Booked Spot
    await Registration.findOneAndUpdate(
      { competitionId: competition._id, userId: registeredUser._id },
      {
        competitionId: competition._id,
        userId: registeredUser._id,
        status: RegistrationStatus.CONFIRMED,
        paymentDetails: {
          transactionId: 'txn_booked_001',
          amount: 99,
          paymentStatus: PaymentStatus.SUCCESS,
        },
        registeredAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 7. Seed Previous Winners
    const winnersData = [
      {
        userName: 'Riya Shah',
        rankTitle: '1st Winner',
        rankPosition: 1,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        winningVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
      {
        userName: 'Aarav Mehta',
        rankTitle: '1st Winner',
        rankPosition: 1,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        winningVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      },
      {
        userName: 'Neha Verma',
        rankTitle: '2nd Winner',
        rankPosition: 2,
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        winningVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      },
      {
        userName: 'Ishita Chaudhry',
        rankTitle: '3rd Winner',
        rankPosition: 3,
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
        winningVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoynies.mp4',
      },
    ];

    for (const winner of winnersData) {
      await Winner.findOneAndUpdate(
        { competitionId: competition._id, userName: winner.userName },
        { ...winner, competitionId: competition._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✅ Seeded ${winnersData.length} previous winners.`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding error:', error);
    if (process.argv[1] && process.argv[1].includes('seed')) {
      process.exit(1);
    }
  }
};

// Execute if run directly
if (process.argv[1] && process.argv[1].includes('seed')) {
  seedDatabase().then(() => disconnectDatabase());
}
