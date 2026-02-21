/**
 * {Feature} Types
 * Shared between frontend and backend
 *
 * Replace {Feature}, {Entity}, etc. with actual names
 */

/**
 * Entity status enum
 */
export type EntityStatus = "active" | "completed" | "cancelled";

/**
 * Core entity interface
 */
export interface Entity {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdDate: string; // ISO string for JSON serialization
  lastModifiedDate: string;
  status: EntityStatus;
}

/**
 * API request types
 */
export interface CreateEntityRequest {
  userId: string;
  name: string;
  description?: string;
}

export interface UpdateEntityRequest {
  name?: string;
  description?: string;
  status?: EntityStatus;
}

/**
 * API response wrapper (matches backend successResponse)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
