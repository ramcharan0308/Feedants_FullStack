export enum CompetitionLifecycleState {
  UPCOMING = 'UPCOMING',
  REGISTRATION_OPEN = 'REGISTRATION_OPEN',
  REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
  SUBMISSION_OPEN = 'SUBMISSION_OPEN',
  UNDER_JUDGING = 'UNDER_JUDGING',
  COMPLETED = 'COMPLETED',
}

export interface ILifecycleDates {
  registerBefore: Date | string;
  submissionStarts: Date | string;
  submissionEnds: Date | string;
  resultDate: Date | string;
}

export interface ILifecycleEvaluationInput {
  dates: ILifecycleDates;
  totalSpots: number;
  bookedSpots: number;
  serverTime?: Date;
}

export interface ILifecycleStatus {
  state: CompetitionLifecycleState;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  isSoldOut: boolean;
  remainingSpots: number;
  secondsUntilRegistrationCloses: number;
  secondsUntilSubmissionStarts: number;
  secondsUntilSubmissionEnds: number;
  serverTimeIso: string;
}

export class CompetitionLifecycleService {
  /**
   * Computes the lifecycle status and time metrics using server time as the sole source of truth.
   */
  public static evaluateStatus(input: ILifecycleEvaluationInput): ILifecycleStatus {
    const serverTime = input.serverTime ? new Date(input.serverTime) : new Date();
    const serverMs = serverTime.getTime();

    const registerBeforeMs = new Date(input.dates.registerBefore).getTime();
    const submissionStartsMs = new Date(input.dates.submissionStarts).getTime();
    const submissionEndsMs = new Date(input.dates.submissionEnds).getTime();
    const resultDateMs = new Date(input.dates.resultDate).getTime();

    const totalSpots = Math.max(0, input.totalSpots);
    const bookedSpots = Math.max(0, input.bookedSpots);
    const remainingSpots = Math.max(0, totalSpots - bookedSpots);
    const isSoldOut = bookedSpots >= totalSpots;

    // Condition evaluations
    const isBeforeRegisterBefore = serverMs < registerBeforeMs;
    const isRegistrationOpen = isBeforeRegisterBefore && !isSoldOut;
    const isSubmissionOpen = serverMs >= submissionStartsMs && serverMs <= submissionEndsMs;

    // Countdown calculations (in seconds)
    const secondsUntilRegistrationCloses = isBeforeRegisterBefore
      ? Math.floor((registerBeforeMs - serverMs) / 1000)
      : 0;

    const secondsUntilSubmissionStarts = serverMs < submissionStartsMs
      ? Math.floor((submissionStartsMs - serverMs) / 1000)
      : 0;

    const secondsUntilSubmissionEnds = isSubmissionOpen
      ? Math.floor((submissionEndsMs - serverMs) / 1000)
      : 0;

    // Determine primary state
    let state: CompetitionLifecycleState;

    if (serverMs >= resultDateMs) {
      state = CompetitionLifecycleState.COMPLETED;
    } else if (serverMs > submissionEndsMs) {
      state = CompetitionLifecycleState.UNDER_JUDGING;
    } else if (serverMs >= submissionStartsMs && serverMs <= submissionEndsMs) {
      state = CompetitionLifecycleState.SUBMISSION_OPEN;
    } else if (isRegistrationOpen) {
      state = CompetitionLifecycleState.REGISTRATION_OPEN;
    } else if (!isBeforeRegisterBefore) {
      state = CompetitionLifecycleState.REGISTRATION_CLOSED;
    } else {
      state = CompetitionLifecycleState.UPCOMING;
    }

    return {
      state,
      isRegistrationOpen,
      isSubmissionOpen,
      isSoldOut,
      remainingSpots,
      secondsUntilRegistrationCloses,
      secondsUntilSubmissionStarts,
      secondsUntilSubmissionEnds,
      serverTimeIso: serverTime.toISOString(),
    };
  }
}
