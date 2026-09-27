import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  referralCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    avatarUrl: { type: String },
    referralCode: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);
