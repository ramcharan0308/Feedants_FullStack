export interface IJudge {
  _id: string;
  name: string;
  designation: string;
  experienceYears: string;
  avatarUrl: string;
  introVideoUrl: string;
}

export interface IReward {
  position: number;
  title: string;
  amount: number;
}

export interface ICompetitionDates {
  registerBefore: string;
  submissionStarts: string;
  submissionEnds: string;
  resultDate: string;
}

export interface ICompetitionDetailsContent {
  about: string;
  judgingParameters: string[];
  rulesAndEligibility: string[];
}

export interface IReferralConfig {
  enabled: boolean;
  rewardPerSignup: number;
  defaultCode: string;
}

export interface ICompetitionData {
  id: string;
  title: string;
  category: string;
  tags: string[];
  certificateProvided: boolean;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
  remainingSpots: number;
  isSoldOut: boolean;
  judge: IJudge;
  dates: ICompetitionDates;
  details: ICompetitionDetailsContent;
  rewards: IReward[];
  referralConfig: IReferralConfig;
}

export type LifecycleState =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'SUBMISSION_OPEN'
  | 'UNDER_JUDGING'
  | 'COMPLETED';

export interface ILifecycleInfo {
  state: LifecycleState;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  isSoldOut: boolean;
  secondsUntilRegistrationCloses: number;
  secondsUntilSubmissionStarts: number;
  secondsUntilSubmissionEnds: number;
  serverTime: string;
}

export interface IUserState {
  isRegistered: boolean;
  registrationId: string | null;
  registeredAt: string | null;
  hasSubmitted: boolean;
  submissionId: string | null;
  submissionStatus: string | null;
}

export interface ICompetitionDetailsResponse {
  competition: ICompetitionData;
  lifecycle: ILifecycleInfo;
  userState: IUserState;
}

export interface IWinnerItem {
  id: string;
  userName: string;
  rankTitle: string;
  rankPosition: number;
  avatarUrl: string;
  winningVideoUrl: string;
}

export interface IRegistrationResult {
  registrationId: string;
  competitionId: string;
  bookedSpots: number;
  remainingSpots: number;
  registrationStatus: string;
}

export interface ISubmissionResult {
  submissionId: string;
  competitionId: string;
  userId: string;
  mediaUrl: string;
  caption?: string;
  status: string;
  submittedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
}
