// Custom error classes for application-level errors
import { ApiErrorCode } from '@meeting-followup/shared';

export class AppError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(ApiErrorCode.VALIDATION_ERROR, message, 400, details);
    this.name = 'ValidationError';
  }
}

// 404 Not Found
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`;
    super(ApiErrorCode.NOT_FOUND, message, 404);
    this.name = 'NotFoundError';
  }
}

// 409 Conflict
export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(ApiErrorCode.CONFLICT, message, 409, details);
    this.name = 'ConflictError';
  }
}

// 401 Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(ApiErrorCode.UNAUTHORIZED, message, 401);
    this.name = 'UnauthorizedError';
  }
}

// 403 Forbidden
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(ApiErrorCode.FORBIDDEN, message, 403);
    this.name = 'ForbiddenError';
  }
}

// Helper to check if error is a Prisma error
export function isPrismaError(error: unknown): error is { code: string; meta?: unknown } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

// Map Prisma errors to AppErrors
export function handlePrismaError(error: unknown): AppError {
  if (!isPrismaError(error)) {
    return new AppError(ApiErrorCode.DATABASE_ERROR, 'Database operation failed', 500);
  }

  switch (error.code) {
    case 'P2002': // Unique constraint violation
      return new ConflictError('Record with this value already exists', { prismaCode: error.code });
    case 'P2025': // Record not found
      return new NotFoundError('Resource');
    case 'P2003': // Foreign key constraint violation
      return new ValidationError('Invalid reference to related record', { prismaCode: error.code });
    default:
      return new AppError(ApiErrorCode.DATABASE_ERROR, 'Database operation failed', 500, {
        prismaCode: error.code,
      });
  }
}
