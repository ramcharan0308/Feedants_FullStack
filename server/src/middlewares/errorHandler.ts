import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${req.method} ${req.originalUrl} - Status: ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      code: err instanceof AppError ? 'APP_ERROR' : 'INTERNAL_SERVER_ERROR',
      message
    },
    timestamp: new Date().toISOString()
  });
};
