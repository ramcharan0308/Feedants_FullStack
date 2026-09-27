import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid MongoDB ObjectId parameter',
});

export const getCompetitionParamsSchema = z.object({
  id: objectIdSchema,
});

export const registerBodySchema = z.object({
  paymentToken: z.string().optional().default('pay_mock_success'),
});

export const submitBodySchema = z.object({
  mediaUrl: z.string().url('mediaUrl must be a valid HTTP/HTTPS URL').max(1000, 'mediaUrl too long'),
  caption: z.string().max(500, 'Caption must not exceed 500 characters').optional(),
});
