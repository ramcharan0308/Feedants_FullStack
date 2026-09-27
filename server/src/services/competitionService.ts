import mongoose from 'mongoose';
import { Competition, User, Registration, Winner, Submission, RegistrationStatus, PaymentStatus, SubmissionStatus } from '../models/index.js';
import { CompetitionLifecycleService } from './competitionLifecycleService.js';
import { AppError } from '../utils/AppError.js';

export class CompetitionService {
  /**
   * Retrieves competition details, judge information, lifecycle calculations,
   * and current user participation state.
   */
  public static async getCompetitionDetails(competitionId: string, userId?: string) {
    const competition = await Competition.findById(competitionId).populate('judgeId').lean();

    if (!competition) {
      throw new AppError('Competition not found', 404);
    }

    // Evaluate lifecycle domain logic using server time
    const lifecycle = CompetitionLifecycleService.evaluateStatus({
      dates: competition.dates,
      totalSpots: competition.totalSpots,
      bookedSpots: competition.bookedSpots,
    });

    let userState = {
      isRegistered: false,
      registrationId: null as string | null,
      registeredAt: null as Date | null,
      hasSubmitted: false,
      submissionId: null as string | null,
      submissionStatus: null as string | null,
    };

    if (userId) {
      const registration = await Registration.findOne({
        competitionId: competition._id,
        userId,
        status: RegistrationStatus.CONFIRMED,
      }).lean();

      if (registration) {
        userState.isRegistered = true;
        userState.registrationId = registration._id.toString();
        userState.registeredAt = registration.registeredAt;
      }

      const submission = await Submission.findOne({
        competitionId: competition._id,
        userId,
      }).lean();

      if (submission) {
        userState.hasSubmitted = true;
        userState.submissionId = submission._id.toString();
        userState.submissionStatus = submission.status;
      }
    }

    const { judgeId, ...competitionRest } = competition as any;

    return {
      competition: {
        id: competition._id.toString(),
        title: competitionRest.title,
        category: competitionRest.category,
        tags: competitionRest.tags,
        certificateProvided: competitionRest.certificateProvided,
        prizePool: competitionRest.prizePool,
        entryFee: competitionRest.entryFee,
        totalSpots: competitionRest.totalSpots,
        bookedSpots: competitionRest.bookedSpots,
        remainingSpots: lifecycle.remainingSpots,
        isSoldOut: lifecycle.isSoldOut,
        judge: judgeId,
        dates: competitionRest.dates,
        details: competitionRest.details,
        rewards: competitionRest.rewards,
        referralConfig: competitionRest.referralConfig,
      },
      lifecycle: {
        state: lifecycle.state,
        isRegistrationOpen: lifecycle.isRegistrationOpen,
        isSubmissionOpen: lifecycle.isSubmissionOpen,
        isSoldOut: lifecycle.isSoldOut,
        secondsUntilRegistrationCloses: lifecycle.secondsUntilRegistrationCloses,
        secondsUntilSubmissionStarts: lifecycle.secondsUntilSubmissionStarts,
        secondsUntilSubmissionEnds: lifecycle.secondsUntilSubmissionEnds,
        serverTime: lifecycle.serverTimeIso,
      },
      userState,
    };
  }

  /**
   * Retrieves past winners for the specified competition sorted by rank position.
   */
  public static async getPastWinners(competitionId: string) {
    const competitionExists = await Competition.exists({ _id: competitionId });
    if (!competitionExists) {
      throw new AppError('Competition not found', 404);
    }

    const winners = await Winner.find({ competitionId })
      .sort({ rankPosition: 1 })
      .lean();

    return winners.map((w) => ({
      id: w._id.toString(),
      userName: w.userName,
      rankTitle: w.rankTitle,
      rankPosition: w.rankPosition,
      avatarUrl: w.avatarUrl,
      winningVideoUrl: w.winningVideoUrl,
    }));
  }

  /**
   * Atomically registers a user for a competition using MongoDB transactions,
   * atomic spot reservation, and automatic WriteConflict retry logic.
   */
  public static async registerUser(competitionId: string, userId: string, paymentToken?: string) {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // 1. Fetch competition within session
        const competition = await Competition.findById(competitionId).session(session);
        if (!competition) {
          throw new AppError('Competition not found', 404);
        }

        // 2. Check user registration state within session
        const existingRegistration = await Registration.findOne({
          competitionId,
          userId,
          status: RegistrationStatus.CONFIRMED,
        }).session(session);

        if (existingRegistration) {
          throw new AppError('User is already registered for this competition', 409);
        }

        // 3. Evaluate lifecycle state
        const lifecycle = CompetitionLifecycleService.evaluateStatus({
          dates: competition.dates,
          totalSpots: competition.totalSpots,
          bookedSpots: competition.bookedSpots,
        });

        if (!lifecycle.isRegistrationOpen) {
          if (lifecycle.isSoldOut) {
            throw new AppError('Sorry, all participation spots for this competition have been filled.', 410);
          }
          throw new AppError('Registration for this competition is closed.', 400);
        }

        // 4. ATOMIC SPOT RESERVATION: bookedSpots < totalSpots
        const updatedCompetition = await Competition.findOneAndUpdate(
          {
            _id: competitionId,
            bookedSpots: { $lt: competition.totalSpots },
          },
          {
            $inc: { bookedSpots: 1 },
          },
          { session, new: true }
        );

        if (!updatedCompetition) {
          throw new AppError('Sorry, all participation spots for this competition have been filled.', 410);
        }

        // 5. Create Registration within session
        const [registration] = await Registration.create(
          [
            {
              competitionId,
              userId,
              status: RegistrationStatus.CONFIRMED,
              paymentDetails: {
                transactionId: `txn_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                amount: competition.entryFee,
                paymentStatus: PaymentStatus.SUCCESS,
              },
              registeredAt: new Date(),
            },
          ],
          { session }
        );

        await session.commitTransaction();

        const remainingSpots = Math.max(0, updatedCompetition.totalSpots - updatedCompetition.bookedSpots);

        return {
          registrationId: registration._id.toString(),
          competitionId,
          bookedSpots: updatedCompetition.bookedSpots,
          remainingSpots,
          registrationStatus: registration.status,
        };
      } catch (error: any) {
        await session.abortTransaction();

        // Catch WriteConflict / TransientTransactionError for concurrency retries
        const isWriteConflict =
          error.code === 112 ||
          error.message?.includes('Write conflict') ||
          error.errorLabels?.includes('TransientTransactionError');

        if (isWriteConflict && attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 15 * attempt));
          continue;
        }

        // Catch Mongo Duplicate Key error
        if (error.code === 11000 || error.message?.includes('E11000')) {
          throw new AppError('User is already registered for this competition', 409);
        }

        throw error;
      } finally {
        session.endSession();
      }
    }

    throw new AppError('Registration request could not be processed due to high concurrency. Please try again.', 500);
  }

  /**
   * Submits an entry for a registered user.
   */
  public static async submitEntry(competitionId: string, userId: string, mediaUrl: string, caption?: string) {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    const competition = await Competition.findById(competitionId).lean();
    if (!competition) {
      throw new AppError('Competition not found', 404);
    }

    // Verify submission window
    const lifecycle = CompetitionLifecycleService.evaluateStatus({
      dates: competition.dates,
      totalSpots: competition.totalSpots,
      bookedSpots: competition.bookedSpots,
    });

    if (!lifecycle.isSubmissionOpen) {
      throw new AppError('Submission window is not currently open for this competition.', 400);
    }

    // Verify user is registered
    const isRegistered = await Registration.exists({
      competitionId,
      userId,
      status: RegistrationStatus.CONFIRMED,
    });

    if (!isRegistered) {
      throw new AppError('You must be a paid registered participant to upload a submission.', 403);
    }

    // Check duplicate submission
    const existingSubmission = await Submission.exists({ competitionId, userId });
    if (existingSubmission) {
      throw new AppError('You have already submitted an entry for this competition.', 409);
    }

    try {
      const submission = await Submission.create({
        competitionId,
        userId,
        mediaUrl,
        caption,
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
      });

      return {
        submissionId: submission._id.toString(),
        competitionId,
        userId,
        mediaUrl: submission.mediaUrl,
        caption: submission.caption,
        status: submission.status,
        submittedAt: submission.submittedAt,
      };
    } catch (error: any) {
      if (error.code === 11000 || error.message?.includes('E11000')) {
        throw new AppError('You have already submitted an entry for this competition.', 409);
      }
      throw error;
    }
  }
}
