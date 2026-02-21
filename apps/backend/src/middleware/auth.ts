// Authentication Middleware - Clerk JWT verification
import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from '@clerk/clerk-sdk-node';
import { UnauthorizedError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
    sessionId: string;
    claims: Record<string, unknown>;
  };
}

/**
 * Development bypass middleware
 * Allows testing with x-user-id header instead of JWT token
 * ONLY WORKS IN DEVELOPMENT MODE
 */
function devBypassAuth(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'development') {
    const userId = req.headers['x-user-id'] as string;
    if (userId) {
      console.log(`🔓 Dev mode: Using test user ID: ${userId}`);
      (req as any).auth = {
        userId,
        sessionId: 'dev-session',
        claims: {},
      };
      return next();
    }
  }
  next();
}

/**
 * Require authentication for protected routes
 * Uses Clerk's Express middleware in production
 * Accepts x-user-id header in development for testing
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Development bypass - check for x-user-id header
  if (process.env.NODE_ENV === 'development' && req.headers['x-user-id']) {
    return devBypassAuth(req, res, next);
  }

  // Production - use Clerk authentication
  return ClerkExpressRequireAuth({
    onError: (error) => {
      throw new UnauthorizedError('Authentication required');
    },
  })(req, res, next);
}

/**
 * Extract user ID from authenticated request
 */
export function getUserId(req: Request): string {
  const authReq = req as RequireAuthProp<Request>;
  const userId = authReq.auth?.userId;

  if (!userId) {
    throw new UnauthorizedError('User ID not found in request');
  }

  return userId;
}

/**
 * Optional authentication - doesn't fail if not authenticated
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as any;
    if (authReq.auth?.userId) {
      (req as any).userId = authReq.auth.userId;
    }
    next();
  } catch (error) {
    next(); // Continue without auth
  }
}
