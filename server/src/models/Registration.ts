import { Schema, model, Document, Types } from 'mongoose';

export enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface IPaymentDetails {
  transactionId?: string;
  amount: number;
  paymentStatus: PaymentStatus;
}

export interface IRegistration extends Document {
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  status: RegistrationStatus;
  paymentDetails: IPaymentDetails;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(RegistrationStatus),
      default: RegistrationStatus.CONFIRMED,
      required: true,
    },
    paymentDetails: {
      transactionId: { type: String },
      amount: { type: Number, required: true },
      paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.SUCCESS,
        required: true,
      },
    },
    registeredAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

/**
 * MANDATORY UNIQUE COMPOUND INDEX
 * Ensures database-level uniqueness to prevent duplicate registrations even if
 * multiple concurrent registration requests bypass application-level checks.
 */
registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Registration = model<IRegistration>('Registration', registrationSchema);
