import { Schema, model, Document, Types } from 'mongoose';

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface ISubmission extends Document {
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  mediaUrl: string;
  caption?: string;
  status: SubmissionStatus;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true },
    caption: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.SUBMITTED,
      required: true,
    },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

/**
 * UNIQUE COMPOUND INDEX FOR SUBMISSION
 * Enforces business rule: Exactly ONE submission per user per competition.
 */
submissionSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Submission = model<ISubmission>('Submission', submissionSchema);
