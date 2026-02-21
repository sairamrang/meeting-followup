"use strict";
// API request/response types
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorCode = void 0;
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
// Error codes
var ApiErrorCode;
(function (ApiErrorCode) {
    // Authentication & Authorization
    ApiErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ApiErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ApiErrorCode["INVALID_TOKEN"] = "INVALID_TOKEN";
    // Validation
    ApiErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ApiErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ApiErrorCode["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    // Resource errors
    ApiErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ApiErrorCode["ALREADY_EXISTS"] = "ALREADY_EXISTS";
    ApiErrorCode["CONFLICT"] = "CONFLICT";
    // Business logic
    ApiErrorCode["FOLLOWUP_NOT_DRAFT"] = "FOLLOWUP_NOT_DRAFT";
    ApiErrorCode["FOLLOWUP_ALREADY_PUBLISHED"] = "FOLLOWUP_ALREADY_PUBLISHED";
    ApiErrorCode["SLUG_ALREADY_TAKEN"] = "SLUG_ALREADY_TAKEN";
    ApiErrorCode["INVALID_SLUG"] = "INVALID_SLUG";
    // File upload
    ApiErrorCode["FILE_TOO_LARGE"] = "FILE_TOO_LARGE";
    ApiErrorCode["INVALID_FILE_TYPE"] = "INVALID_FILE_TYPE";
    ApiErrorCode["UPLOAD_FAILED"] = "UPLOAD_FAILED";
    // Server errors
    ApiErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ApiErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    ApiErrorCode["STORAGE_ERROR"] = "STORAGE_ERROR";
    // Rate limiting
    ApiErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
})(ApiErrorCode || (exports.ApiErrorCode = ApiErrorCode = {}));
// Success response helper
function successResponse(data, meta) {
    return {
        success: true,
        data,
        meta,
    };
}
// Error response helper
function errorResponse(code, message, details, field) {
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
//# sourceMappingURL=api.types.js.map