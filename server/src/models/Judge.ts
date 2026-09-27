import { Schema, model, Document } from 'mongoose';

export interface IJudge extends Document {
  name: string;
  designation: string;
  experienceYears: string;
  avatarUrl: string;
  introVideoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const judgeSchema = new Schema<IJudge>(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    experienceYears: { type: String, required: true, trim: true },
    avatarUrl: { type: String, required: true },
    introVideoUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Judge = model<IJudge>('Judge', judgeSchema);
