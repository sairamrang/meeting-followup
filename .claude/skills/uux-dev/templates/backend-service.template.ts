/**
 * {Feature} Service
 * Business logic, validation, and data access
 *
 * Replace {Feature}, {Entity}, etc. with actual names
 */

import {
  Entity,
  CreateEntityRequest,
  UpdateEntityRequest,
} from "../../../shared/dist/index.js";
import { createAdapter } from "../data/adapters/index.js";
import { ApiError } from "../middleware/error-handler.js";
import { ApiErrorCode } from "../../../shared/dist/index.js";
import { generateEntityId } from "../utils/id-generator.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load fixtures
const fixturesPath = path.join(__dirname, "../../fixtures/entities.json");
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf-8"));

// Create adapter
const entityAdapter = createAdapter<Entity>("entities", fixtures);

export class EntityService {
  /**
   * Get all entities for a user
   */
  async getAll(userId: string): Promise<Entity[]> {
    const entities = await entityAdapter.findAll({ userId });
    return entities;
  }

  /**
   * Get entity by ID
   */
  async getById(id: string, userId: string): Promise<Entity> {
    const entity = await entityAdapter.findById(id);

    if (!entity) {
      throw new ApiError(
        404,
        "Entity not found",
        ApiErrorCode.RESOURCE_NOT_FOUND,
      );
    }

    if (entity.userId !== userId) {
      throw new ApiError(403, "Access denied", ApiErrorCode.FORBIDDEN);
    }

    return entity;
  }

  /**
   * Create new entity
   */
  async create(request: CreateEntityRequest): Promise<Entity> {
    // Validation
    if (!request.name || request.name.trim().length === 0) {
      throw new ApiError(
        400,
        "Name is required",
        ApiErrorCode.VALIDATION_ERROR,
      );
    }

    // Create entity
    const entity: Entity = {
      id: generateEntityId("ENTITY"),
      userId: request.userId,
      name: request.name.trim(),
      description: request.description,
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      status: "active",
    };

    await entityAdapter.create(entity);
    return entity;
  }

  /**
   * Update entity
   */
  async update(
    id: string,
    userId: string,
    request: UpdateEntityRequest,
  ): Promise<Entity> {
    const entity = await this.getById(id, userId);

    // Apply updates
    const updated: Entity = {
      ...entity,
      name: request.name !== undefined ? request.name.trim() : entity.name,
      description:
        request.description !== undefined
          ? request.description
          : entity.description,
      status: request.status ?? entity.status,
      lastModifiedDate: new Date().toISOString(),
    };

    await entityAdapter.update(id, updated);
    return updated;
  }

  /**
   * Delete entity
   */
  async delete(id: string, userId: string): Promise<void> {
    await this.getById(id, userId); // Verify exists and authorized
    await entityAdapter.delete(id);
  }
}

export const entityService = new EntityService();
