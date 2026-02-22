// Server - Express application entry point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import {
  companyRoutes,
  contactRoutes,
  followupRoutes,
  libraryRoutes,
  companyContentRoutes,
  templateRoutes,
  fileRoutes,
  analyticsRoutes,
  aiRoutes,
  confirmationRoutes,
  notificationRoutes,
} from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Clerk authentication middleware (applied globally)
app.use(ClerkExpressWithAuth());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/companies', companyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/company-content', companyContentRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/confirmations', confirmationRoutes);
app.use('/api/notifications', notificationRoutes);

// Public follow-up route (alternative to /api/followups/public/:slug)
app.use('/f', followupRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server (skip in test and serverless environments)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
  });
}

export default app;
