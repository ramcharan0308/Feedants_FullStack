import rateLimit from 'express-rate-limit';

export const registrationRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // Max 10 registration attempts per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REGISTRATION_REQUESTS',
      message: 'Too many registration requests. Please wait a minute before trying again.',
    },
  },
});
