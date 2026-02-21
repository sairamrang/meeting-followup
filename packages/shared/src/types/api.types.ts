// API request/response types

// Standard API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

// Error response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string; // For validation errors
}

// Response metadata
export interface ResponseMeta {
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common query filters
export interface QueryFilters {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

// User context from Clerk
export interface UserContext {
  userId: string;
  email?: string;
  name?: string;
}

// Health check response
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  database: 'connected' | 'disconnected';
  storage: 'connected' | 'disconnected';
}

// Error codes
export enum ApiErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Business logic
  FOLLOWUP_NOT_DRAFT = 'FOLLOWUP_NOT_DRAFT',
  FOLLOWUP_ALREADY_PUBLISHED = 'FOLLOWUP_ALREADY_PUBLISHED',
  SLUG_ALREADY_TAKEN = 'SLUG_ALREADY_TAKEN',
  INVALID_SLUG = 'INVALID_SLUG',

  // File upload
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// Success response helper
export function successResponse<T>(data: T, meta?: ResponseMeta): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
  };
}

// Error response helper
export function errorResponse(
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>,
  field?: string
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      field,
    },
  };
}
