# Meeting Follow-Up System

AI-powered meeting follow-up system that replaces low-engagement email follow-ups with personalized, trackable web pages.

## Overview

Replace 15% email engagement with 40%+ web engagement, accelerate deal velocity by 40% (12 days → 7 days), and provide measurable insights into prospect interest.

## Project Structure

```
meeting-follow-up-system/
├── apps/
│   ├── backend/          # Express API (Node.js + TypeScript)
│   └── frontend/         # React app (Vite + TypeScript)
├── packages/
│   └── shared/           # Shared TypeScript types
├── .temn/                # Specifications and planning
│   ├── prds/            # Product requirements
│   └── specs/           # Functional & technical specs
└── package.json          # Root workspace configuration
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Hook Form, Tiptap
- **Backend:** Node.js 20, Express, TypeScript, Prisma, Clerk Auth
- **Database:** PostgreSQL 15 (Supabase)
- **Storage:** Supabase Storage (S3-compatible)
- **Deployment:** Vercel (frontend + serverless API)
- **Monitoring:** Vercel Analytics, Sentry

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- npm 10+
- PostgreSQL 15+ (or Supabase account)

### Installation

```bash
# Install all dependencies
npm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Initialize database
cd apps/backend
npx prisma migrate dev
npx prisma generate

# Seed database with templates
npm run seed
```

### Development

```bash
# Run all services in development mode
npm run dev

# Backend: http://localhost:3001
# Frontend: http://localhost:3000

# Or run individually
cd apps/backend && npm run dev
cd apps/frontend && npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
cd apps/frontend && npm run test:e2e
```

## Features

### MVP (Phase 1)
- ✅ Follow-up page creator with rich text editor
- ✅ Auto-save & draft management
- ✅ Template library (Sales, Partnership, Demo)
- ✅ Company content library
- ✅ Public follow-up pages (mobile-responsive)
- ✅ Post-publish editing
- ✅ Basic analytics dashboard
- ✅ Follow-up list & management

### Success Metrics
- **Engagement Rate:** 40%+ (vs 15% email baseline)
- **Time to Next Action:** 7 days (vs 12 days baseline)
- **Follow-Up Creation Time:** <10 minutes
- **Draft Completion Rate:** 80%+

## Documentation

- **PRD:** [.temn/prds/meeting-follow-up-system-prd.md](.temn/prds/meeting-follow-up-system-prd.md)
- **Functional Spec:** [.temn/specs/01-meeting-follow-up-system/spec-functional.md](.temn/specs/01-meeting-follow-up-system/spec-functional.md)
- **Technical Spec:** [.temn/specs/01-meeting-follow-up-system/spec-technical.md](.temn/specs/01-meeting-follow-up-system/spec-technical.md)
- **Development Plan:** [.temn/specs/01-meeting-follow-up-system/plan/](.temn/specs/01-meeting-follow-up-system/plan/)

## License

Proprietary - All rights reserved

## Contributors

Built with [Temenos SDLC OS](https://github.com/temenos/sdlc-os)
