import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const msg = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(new AppError(`Validation Error: ${msg}`, 400));
      }
      next(error);
    }
  };
};

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const msg = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(new AppError(`Validation Error: ${msg}`, 400));
      }
      next(error);
    }
  };
};
