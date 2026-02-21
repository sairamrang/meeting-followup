/**
 * {Feature} Service
 * Frontend API client using openapi-fetch
 *
 * Replace {Feature}, {Entity}, etc. with actual names
 */

import type {
  Entity,
  CreateEntityRequest,
  UpdateEntityRequest,
} from "../../../shared/dist/index.js";
import { api, handleApiError } from "./api-client.js";

export class EntityService {
  private readonly userId = "user-123"; // Hardcoded for now

  /**
   * Get all entities
   */
  async getAll(): Promise<Entity[]> {
    const { data, error } = await api.GET("/api/v1/entities", {
      params: {
        query: { userId: this.userId },
      },
    });

    if (error) {
      throw handleApiError(error);
    }

    return (data as { data: Entity[] }).data;
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<Entity> {
    const { data, error } = await api.GET("/api/v1/entities/{id}", {
      params: {
        path: { id },
        query: { userId: this.userId },
      },
    });

    if (error) {
      throw handleApiError(error);
    }

    return (data as { data: Entity }).data;
  }

  /**
   * Create entity
   */
  async create(request: Omit<CreateEntityRequest, "userId">): Promise<Entity> {
    const { data, error } = await api.POST("/api/v1/entities", {
      body: {
        ...request,
        userId: this.userId,
      } as CreateEntityRequest,
    });

    if (error) {
      throw handleApiError(error);
    }

    return (data as { data: Entity }).data;
  }

  /**
   * Update entity
   */
  async update(id: string, request: UpdateEntityRequest): Promise<Entity> {
    const { data, error } = await api.PUT("/api/v1/entities/{id}", {
      params: {
        path: { id },
        query: { userId: this.userId },
      },
      body: request,
    });

    if (error) {
      throw handleApiError(error);
    }

    return (data as { data: Entity }).data;
  }

  /**
   * Delete entity
   */
  async delete(id: string): Promise<void> {
    const { error } = await api.DELETE("/api/v1/entities/{id}", {
      params: {
        path: { id },
        query: { userId: this.userId },
      },
    });

    if (error) {
      throw handleApiError(error);
    }
  }
}

export const entityService = new EntityService();
