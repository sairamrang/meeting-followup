export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    field?: string;
}
export interface ResponseMeta {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
}
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface QueryFilters {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}
export interface UserContext {
    userId: string;
    email?: string;
    name?: string;
}
export interface HealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    version: string;
    database: 'connected' | 'disconnected';
    storage: 'connected' | 'disconnected';
}
export declare enum ApiErrorCode {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    INVALID_TOKEN = "INVALID_TOKEN",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
    NOT_FOUND = "NOT_FOUND",
    ALREADY_EXISTS = "ALREADY_EXISTS",
    CONFLICT = "CONFLICT",
    FOLLOWUP_NOT_DRAFT = "FOLLOWUP_NOT_DRAFT",
    FOLLOWUP_ALREADY_PUBLISHED = "FOLLOWUP_ALREADY_PUBLISHED",
    SLUG_ALREADY_TAKEN = "SLUG_ALREADY_TAKEN",
    INVALID_SLUG = "INVALID_SLUG",
    FILE_TOO_LARGE = "FILE_TOO_LARGE",
    INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
    UPLOAD_FAILED = "UPLOAD_FAILED",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
    STORAGE_ERROR = "STORAGE_ERROR",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
}
export declare function successResponse<T>(data: T, meta?: ResponseMeta): ApiResponse<T>;
export declare function errorResponse(code: ApiErrorCode, message: string, details?: Record<string, unknown>, field?: string): ApiResponse;
//# sourceMappingURL=api.types.d.ts.map