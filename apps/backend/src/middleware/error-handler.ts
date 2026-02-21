// Error Handler Middleware - Centralized error handling
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { errorResponse, ApiErrorCode } from '@meeting-followup/shared';

/**
 * Global error handler middleware
 * Converts all errors to standardized API error responses
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle AppError instances
  if (error instanceof AppError) {
    const response = errorResponse(error.code, error.message, error.details);
    return res.status(error.statusCode).json(response);
  }

  // Handle unknown errors
  const response = errorResponse(
    ApiErrorCode.INTERNAL_ERROR,
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'An unexpected error occurred'
  );

  return res.status(500).json(response);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response) {
  const response = errorResponse(
    ApiErrorCode.NOT_FOUND,
    `Cannot ${req.method} ${req.path}`
  );
  return res.status(404).json(response);
}

/**
 * Async handler wrapper - catches async errors
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
