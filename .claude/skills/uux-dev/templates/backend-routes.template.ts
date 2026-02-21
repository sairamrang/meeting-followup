/**
 * {Feature} Routes
 * Express REST API endpoints with Swagger documentation
 *
 * Replace {feature}, {entity}, etc. with actual names
 */

import { Router, Request, Response, NextFunction } from "express";
import { entityService } from "../services/entity.service.js";
import { successResponse } from "../utils/response.js";
import type {
  CreateEntityRequest,
  UpdateEntityRequest,
} from "../../../shared/dist/index.js";

const router = Router();

/**
 * @swagger
 * /api/v1/entities:
 *   get:
 *     summary: Get all entities
 *     tags: [Entities]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of entities
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string;
    const entities = await entityService.getAll(userId);
    res.json(successResponse(entities, req));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/entities/{id}:
 *   get:
 *     summary: Get entity by ID
 *     tags: [Entities]
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;
    const entity = await entityService.getById(id, userId);
    res.json(successResponse(entity, req));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/entities:
 *   post:
 *     summary: Create new entity
 *     tags: [Entities]
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: CreateEntityRequest = req.body;
    const entity = await entityService.create(request);
    res.status(201).json(successResponse(entity, req));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/entities/{id}:
 *   put:
 *     summary: Update entity
 *     tags: [Entities]
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;
    const request: UpdateEntityRequest = req.body;
    const entity = await entityService.update(id, userId, request);
    res.json(successResponse(entity, req));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/entities/{id}:
 *   delete:
 *     summary: Delete entity
 *     tags: [Entities]
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string;
      await entityService.delete(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;

/**
 * After creating routes, register in backend/src/server.ts:
 *
 * import entityRoutes from "./routes/entity.routes.js";
 * app.use("/api/v1/entities", entityRoutes);
 */
