// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: any;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  console.error(`[Error] ${code} (${statusCode}): ${message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(err.errors && { details: err.errors }),
    },
  });
};