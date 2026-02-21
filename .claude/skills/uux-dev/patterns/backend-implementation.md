# Backend Implementation Patterns

## Overview

Backend implementation follows these patterns:
1. Shared types in `shared/types/`
2. JSON fixtures in `backend/fixtures/`
3. Services in `backend/src/services/`
4. Routes in `backend/src/routes/`

---

## Pattern: Shared Types

**File:** `shared/types/{feature}.types.ts`

**Purpose:** TypeScript interfaces shared between frontend and backend

**Key Rules:**
- Use ISO date strings (not Date objects) for JSON serialization
- Include all CRUD request/response types
- Export everything for frontend/backend consumption

**Template:** [../templates/shared-types.template.ts](../templates/shared-types.template.ts)

### Example Structure

```typescript
// Goal status enum
export type GoalStatus = "active" | "completed" | "cancelled";

// Core entity
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO string for JSON serialization
  createdDate: string;
  lastModifiedDate: string;
  status: GoalStatus;
  category?: string;
}

// API request types
export interface CreateGoalRequest {
  userId: string;
  name: string;
  targetAmount: number;
  targetDate: string; // ISO string
  category?: string;
}

export interface UpdateGoalRequest {
  name?: string;
  targetAmount?: number;
  targetDate?: string;
  category?: string;
}
```

---

## Pattern: Backend Service

**File:** `backend/src/services/{feature}.service.ts`

**Purpose:** Business logic, validation, and data access

**Key Rules:**
- Use `createAdapter<T>()` for data persistence
- Implement full CRUD operations
- Add validation logic
- Handle business rules
- Use ISO strings for dates

**Template:** [../templates/backend-service.template.ts](../templates/backend-service.template.ts)

### Service Structure

```typescript
import { EntityType, CreateRequest, UpdateRequest } from "../../../shared/dist/index.js";
import { createAdapter } from "../data/adapters/index.js";
import { ApiError } from "../middleware/error-handler.js";
import { ApiErrorCode } from "../../../shared/dist/index.js";
import { generateEntityId } from "../utils/id-generator.js";

// Load fixtures and create adapter
const fixturesPath = path.join(__dirname, "../../fixtures/{feature}.json");
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf-8"));
const adapter = createAdapter<EntityType>("{feature}", fixtures);

export class FeatureService {
  // Get all entities
  async getAll(userId: string): Promise<EntityType[]> {
    return adapter.findAll({ userId });
  }

  // Get by ID with authorization
  async getById(id: string, userId: string): Promise<EntityType> {
    const entity = await adapter.findById(id);

    if (!entity) {
      throw new ApiError(404, "Not found", ApiErrorCode.RESOURCE_NOT_FOUND);
    }

    if (entity.userId !== userId) {
      throw new ApiError(403, "Access denied", ApiErrorCode.FORBIDDEN);
    }

    return entity;
  }

  // Create with validation
  async create(request: CreateRequest): Promise<EntityType> {
    // Validation
    if (!request.name?.trim()) {
      throw new ApiError(400, "Name is required", ApiErrorCode.VALIDATION_ERROR);
    }

    const entity: EntityType = {
      id: generateEntityId("PREFIX"),
      ...request,
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
    };

    await adapter.create(entity);
    return entity;
  }

  // Update with validation
  async update(id: string, userId: string, request: UpdateRequest): Promise<EntityType> {
    const entity = await this.getById(id, userId);

    const updated: EntityType = {
      ...entity,
      ...request,
      lastModifiedDate: new Date().toISOString(),
    };

    await adapter.update(id, updated);
    return updated;
  }

  // Delete
  async delete(id: string, userId: string): Promise<void> {
    await this.getById(id, userId); // Verify exists and authorized
    await adapter.delete(id);
  }
}

export const featureService = new FeatureService();
```

---

## Pattern: Backend Routes

**File:** `backend/src/routes/{feature}.routes.ts`

**Purpose:** Express REST API endpoints with Swagger documentation

**Key Rules:**
- Follow RESTful conventions
- Add Swagger JSDoc annotations
- Use service layer for business logic
- Return `successResponse()` wrapper
- Handle errors with try/catch

**Template:** [../templates/backend-routes.template.ts](../templates/backend-routes.template.ts)

### Routes Structure

```typescript
import { Router, Request, Response, NextFunction } from "express";
import { featureService } from "../services/feature.service.js";
import { successResponse } from "../utils/response.js";

const router = Router();

/**
 * @swagger
 * /api/v1/features:
 *   get:
 *     summary: Get all features
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string;
    const items = await featureService.getAll(userId);
    res.json(successResponse(items, req));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/features/{id}:
 *   get:
 *     summary: Get by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;
    const item = await featureService.getById(id, userId);
    res.json(successResponse(item, req));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/features:
 *   post:
 *     summary: Create new
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await featureService.create(req.body);
    res.status(201).json(successResponse(item, req));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/features/{id}:
 *   put:
 *     summary: Update
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;
    const item = await featureService.update(id, userId, req.body);
    res.json(successResponse(item, req));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/features/{id}:
 *   delete:
 *     summary: Delete
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;
    await featureService.delete(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
```

### Registering Routes

After creating routes, register in `backend/src/server.ts`:

```typescript
import featureRoutes from "./routes/feature.routes.js";
app.use("/api/v1/features", featureRoutes);
```

---

## Pattern: JSON Fixtures

**File:** `backend/fixtures/{feature}.json`

**Purpose:** Sample data for development and testing

**Template:** [../templates/fixtures.template.json](../templates/fixtures.template.json)

### Example Structure

```json
{
  "feature_entities": [
    {
      "id": "ENTITY-001",
      "userId": "user-123",
      "name": "Sample Entity",
      "createdDate": "2025-01-01T10:00:00.000Z",
      "lastModifiedDate": "2025-01-15T14:30:00.000Z",
      "status": "active"
    }
  ]
}
```

---

## Error Handling

Use `ApiError` for consistent error responses:

```typescript
import { ApiError } from "../middleware/error-handler.js";
import { ApiErrorCode } from "../../../shared/dist/index.js";

// Not found
throw new ApiError(404, "Entity not found", ApiErrorCode.RESOURCE_NOT_FOUND);

// Forbidden
throw new ApiError(403, "Access denied", ApiErrorCode.FORBIDDEN);

// Validation
throw new ApiError(400, "Name is required", ApiErrorCode.VALIDATION_ERROR);
```

---

## ID Generation

Use `generateEntityId()` for consistent ID format:

```typescript
import { generateEntityId } from "../utils/id-generator.js";

const id = generateEntityId("GOAL");  // "GOAL-abc123..."
const id = generateEntityId("CONTRIB");  // "CONTRIB-def456..."
```
