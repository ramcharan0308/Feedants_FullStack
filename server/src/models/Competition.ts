import { Schema, model, Document, Types } from 'mongoose';

export interface IReward {
  position: number;
  title: string;
  amount: number;
}

export interface ICompetitionDates {
  registerBefore: Date;
  submissionStarts: Date;
  submissionEnds: Date;
  resultDate: Date;
}

export interface ICompetitionDetails {
  about: string;
  judgingParameters: string[];
  rulesAndEligibility: string[];
}

export interface IReferralConfig {
  enabled: boolean;
  rewardPerSignup: number;
  defaultCode: string;
}

export interface ICompetition extends Document {
  title: string;
  category: string;
  tags: string[];
  certificateProvided: boolean;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
  judgeId: Types.ObjectId;
  dates: ICompetitionDates;
  details: ICompetitionDetails;
  rewards: IReward[];
  referralConfig: IReferralConfig;
  createdAt: Date;
  updatedAt: Date;
  // Virtual getter
  remainingSpots: number;
}

const rewardSchema = new Schema<IReward>(
  {
    position: { type: Number, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const competitionSchema = new Schema<ICompetition>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    certificateProvided: { type: Boolean, default: true },
    prizePool: { type: Number, required: true, min: 0 },
    entryFee: { type: Number, required: true, min: 0 },
    totalSpots: { type: Number, required: true, min: 1 },
    bookedSpots: { type: Number, required: true, default: 0, min: 0 },
    judgeId: { type: Schema.Types.ObjectId, ref: 'Judge', required: true },
    dates: {
      registerBefore: { type: Date, required: true },
      submissionStarts: { type: Date, required: true },
      submissionEnds: { type: Date, required: true },
      resultDate: { type: Date, required: true },
    },
    details: {
      about: { type: String, required: true },
      judgingParameters: [{ type: String }],
      rulesAndEligibility: [{ type: String }],
    },
    rewards: [rewardSchema],
    referralConfig: {
      enabled: { type: Boolean, default: true },
      rewardPerSignup: { type: Number, default: 10 },
      defaultCode: { type: String, default: 'referral123' },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual derived field for remaining spots
competitionSchema.virtual('remainingSpots').get(function (this: ICompetition) {
  return Math.max(0, this.totalSpots - this.bookedSpots);
});

// Indexes for high-performance querying
competitionSchema.index({ 'dates.registerBefore': 1 });
competitionSchema.index({ category: 1 });

export const Competition = model<ICompetition>('Competition', competitionSchema);
