import { Schema, model, Document, Types } from 'mongoose';

export interface IWinner extends Document {
  competitionId: Types.ObjectId;
  userName: string;
  rankTitle: string;
  rankPosition: number;
  avatarUrl: string;
  winningVideoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const winnerSchema = new Schema<IWinner>(
  {
    competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
    userName: { type: String, required: true, trim: true },
    rankTitle: { type: String, required: true, trim: true },
    rankPosition: { type: Number, required: true },
    avatarUrl: { type: String, required: true },
    winningVideoUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

/**
 * INDEX ON COMPETITION_ID
 * Optimizes past winners queries for specific competitions.
 */
winnerSchema.index({ competitionId: 1 });

export const Winner = model<IWinner>('Winner', winnerSchema);
