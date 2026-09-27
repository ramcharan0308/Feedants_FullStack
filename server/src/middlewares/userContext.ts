import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

// Extend Express Request interface to include optional userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const userContext = (req: Request, res: Response, next: NextFunction): void => {
  const userIdHeader = req.headers['x-user-id'];

  if (userIdHeader) {
    const rawUserId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;
    
    if (!mongoose.Types.ObjectId.isValid(rawUserId)) {
      return next(new AppError('Invalid x-user-id header format', 400));
    }

    req.userId = rawUserId;
  }

  next();
};

export const requireUserContext = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.userId) {
    return next(new AppError('x-user-id header is required for this operation', 401));
  }
  next();
};
