# Technical Specification: Meeting Follow-Up System

**Version:** 1.0
**Status:** Draft
**Created:** 2026-01-27
**Functional Spec:** [spec-functional.md](./spec-functional.md)

---

## Overview

This document outlines the technical architecture, implementation approach, and engineering requirements for the Meeting Follow-Up System MVP. The system uses React + Express, PostgreSQL, Supabase Storage, and is deployed on Vercel.

**Architecture Pattern:** Monorepo with separate frontend (React) and backend (Express API), shared TypeScript types, custom analytics tracking.

---

## Tech Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite (fast dev server, optimized builds)
- **Routing:** React Router v6
- **State Management:** Zustand (lightweight, less boilerplate than Redux)
- **Forms:** React Hook Form + Zod validation
- **Rich Text Editor:** Tiptap (extensible, modern WYSIWYG)
- **Styling:** Tailwind CSS + Headless UI (accessible components)
- **HTTP Client:** Axios with interceptors

### Backend
- **Runtime:** Node.js 20+ LTS
- **Framework:** Express.js with TypeScript
- **ORM:** Prisma (type-safe database access)
- **Validation:** Zod (shared with frontend)
- **Authentication:** Clerk (managed auth service)
- **File Upload:** Multer + Supabase Storage SDK

### Database & Storage
- **Primary Database:** PostgreSQL 15+ (managed via Supabase)
- **File Storage:** Supabase Storage (S3-compatible, CDN-backed)
- **Caching:** Redis (optional for MVP, recommended for Phase 2)

### Deployment & Infrastructure
- **Hosting:** Vercel (frontend + serverless API routes)
- **Database:** Supabase hosted PostgreSQL
- **CDN:** Vercel Edge Network (frontend) + Supabase CDN (files)
- **CI/CD:** GitHub Actions → Vercel auto-deploy
- **Monitoring:** Vercel Analytics + Sentry (error tracking)

### Development Tools
- **Monorepo:** pnpm workspaces
- **Linting:** ESLint + Prettier
- **Type Checking:** TypeScript strict mode
- **Testing:** Vitest (unit), Playwright (E2E)
- **API Documentation:** OpenAPI/Swagger

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Frontend (React + Vite)                                  │
│ - Creator Dashboard, Form, Analytics UI                 │
│ - Public Follow-Up Pages (SSR consideration)            │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS/REST API
┌─────────────────▼───────────────────────────────────────┐
│ Backend API (Express + TypeScript)                      │
│ - REST endpoints, Business logic, Auth middleware       │
└─────┬───────────┬───────────────────┬───────────────────┘
      │           │                   │
      │           │                   │
┌─────▼─────┐ ┌──▼──────────┐ ┌──────▼─────────────────┐
│ PostgreSQL│ │ Supabase    │ │ Clerk Auth             │
│ Database  │ │ Storage     │ │ (User Management)      │
│ (Supabase)│ │ (Files/CDN) │ │                        │
└───────────┘ └─────────────┘ └────────────────────────┘
```

### API Architecture Pattern

**RESTful API** with resource-based URLs:
- `POST /api/followups` - Create draft
- `GET /api/followups/:id` - Get follow-up details
- `PATCH /api/followups/:id` - Update draft or published
- `DELETE /api/followups/:id` - Delete draft
- `POST /api/followups/:id/publish` - Publish follow-up
- `POST /api/followups/:id/files` - Upload resource file
- `GET /api/followups/:id/analytics` - Get analytics data
- `GET /api/templates` - List templates
- `GET /api/library` - Get company content library
- `POST /api/library` - Add library item (admin)

**Public Routes (no auth):**
- `GET /followup/:slug` - View published follow-up (served by frontend)
- `POST /api/analytics/track` - Track analytics event (public)
- `GET /api/files/:id/download` - Download file with tracking

---

## Database Schema

### Tables

#### users (managed by Clerk, reference only)
```
id: string (Clerk user ID)
email: string
name: string
created_at: timestamp
```

#### followups
```
id: uuid PRIMARY KEY
user_id: string (FK → Clerk users)
status: enum('draft', 'published')
slug: string UNIQUE (for published)
title: string
meeting_date: date
prospect_company: string
prospect_contacts: jsonb (array of {name, role, email})
meeting_type: enum('sales', 'partnership', 'demo', 'other')
meeting_recap: text (rich text HTML)
next_steps: jsonb (array of {action, owner, deadline, completed})
company_content_refs: jsonb (array of library item IDs)
company_content_overrides: jsonb (local edits that override library)
created_at: timestamp
updated_at: timestamp
published_at: timestamp
```

#### files
```
id: uuid PRIMARY KEY
followup_id: uuid (FK → followups)
filename: string
file_size: integer (bytes)
mime_type: string
storage_path: string (Supabase Storage path)
storage_url: string (CDN URL)
uploaded_at: timestamp
```

#### templates
```
id: uuid PRIMARY KEY
name: string ('Sales Meeting', 'Partnership', 'Demo')
slug: string ('sales-meeting', 'partnership', 'demo')
description: text
structure: jsonb (default sections and content)
created_at: timestamp
```

#### library
```
id: uuid PRIMARY KEY
type: enum('about_us', 'value_prop', 'case_study', 'team_bio')
title: string
content: text (rich text HTML)
created_at: timestamp
updated_at: timestamp
created_by: string (user_id)
```

#### analytics_events
```
id: uuid PRIMARY KEY
followup_id: uuid (FK → followups)
session_id: uuid (generated per visitor session)
event_type: enum('page_view', 'section_view', 'file_download', 'link_click')
event_data: jsonb (section name, file ID, link URL, etc.)
device_type: enum('mobile', 'tablet', 'desktop')
browser: string
location_city: string
location_country: string
ip_hash: string (hashed for privacy)
timestamp: timestamp
```

#### analytics_sessions
```
id: uuid PRIMARY KEY
followup_id: uuid (FK → followups)
session_start: timestamp
session_end: timestamp (nullable, updated on last event)
page_duration: integer (seconds)
device_type: enum
browser: string
location_city: string
location_country: string
```

### Indexes
- `followups.slug` (UNIQUE, for fast public lookups)
- `followups.user_id` (for user's follow-up list)
- `followups.status` (filter published vs draft)
- `analytics_events.followup_id, timestamp` (for analytics queries)
- `analytics_sessions.followup_id` (aggregate queries)

---

## API Endpoints Specification

### Authentication
All creator endpoints require `Authorization: Bearer <Clerk JWT>` header.

### POST /api/followups
**Create new draft follow-up**

Request:
```json
{
  "title": "Acme Corp - Sales Meeting",
  "meeting_date": "2026-01-27",
  "prospect_company": "Acme Corp",
  "prospect_contacts": [{"name": "Jane Doe", "role": "VP Sales", "email": "jane@acme.com"}],
  "meeting_type": "sales",
  "template_id": "uuid" // optional
}
```

Response: `201 Created`
```json
{
  "id": "uuid",
  "status": "draft",
  "slug": null,
  "title": "Acme Corp - Sales Meeting",
  // ... other fields
}
```

### PATCH /api/followups/:id
**Update draft or published follow-up (auto-save endpoint)**

Request:
```json
{
  "meeting_recap": "<p>We discussed...</p>",
  "next_steps": [{"action": "Send proposal", "owner": "us", "deadline": "2026-02-02"}],
  "company_content_refs": ["lib-uuid-1", "lib-uuid-2"]
}
```

Response: `200 OK` (same structure as GET)

### POST /api/followups/:id/publish
**Publish draft (make public)**

Request:
```json
{
  "slug": "acme-corp-jan-27-2026" // optional, auto-generated if not provided
}
```

Response: `200 OK`
```json
{
  "id": "uuid",
  "status": "published",
  "slug": "acme-corp-jan-27-2026",
  "public_url": "https://yourcompany.com/followup/acme-corp-jan-27-2026"
}
```

Errors:
- `409 Conflict` if slug already exists, returns suggested slug

### POST /api/followups/:id/files
**Upload file attachment**

Request: `multipart/form-data`
```
file: <binary>
```

Response: `201 Created`
```json
{
  "id": "uuid",
  "filename": "Product Roadmap.pdf",
  "file_size": 2048576,
  "storage_url": "https://cdn.supabase.co/storage/v1/..."
}
```

Validation:
- Max file size: 10MB
- Max files per follow-up: 10
- Allowed types: PDF, PPTX, DOCX, XLSX, PNG, JPG

### GET /api/followups/:id/analytics
**Get analytics for follow-up**

Response: `200 OK`
```json
{
  "overview": {
    "total_views": 12,
    "unique_visitors": 5,
    "first_viewed_at": "2026-01-27T14:30:00Z",
    "last_viewed_at": "2026-01-28T09:15:00Z",
    "avg_time_on_page": 178 // seconds
  },
  "sections": [
    {"name": "Meeting Recap", "view_percentage": 100},
    {"name": "Next Steps", "view_percentage": 85},
    {"name": "Resources", "view_percentage": 60}
  ],
  "resources": [
    {"file_id": "uuid", "filename": "Roadmap.pdf", "downloads": 3}
  ],
  "visitors": {
    "by_device": {"mobile": 2, "desktop": 3},
    "by_location": {"San Francisco, CA": 3, "New York, NY": 2}
  }
}
```

### POST /api/analytics/track (Public, no auth)
**Track analytics event from prospect viewing page**

Request:
```json
{
  "followup_id": "uuid",
  "session_id": "uuid", // generated client-side, persisted in localStorage
  "event_type": "page_view",
  "event_data": {"section": "Meeting Recap"},
  "device_type": "mobile",
  "browser": "Chrome"
}
```

Response: `204 No Content`

---

## Non-Functional Requirements

### Performance

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| **Page Load Time** | <2s (P95) | Vercel Edge CDN, code splitting, lazy loading |
| **API Response Time** | <500ms (P95) | Database indexes, Prisma query optimization |
| **Auto-Save Latency** | <200ms | Debounced API calls, optimistic UI updates |
| **File Upload** | <5s for 10MB | Direct upload to Supabase Storage, progress indicator |
| **Analytics Query** | <1s | Pre-aggregated data in analytics_sessions table |

### Scalability

- **Concurrent Users:** 100+ creators simultaneously (MVP target)
- **Follow-Ups:** 10,000+ follow-ups (MVP target)
- **Analytics Events:** 1M+ events/month
- **File Storage:** 100GB total (10,000 follow-ups × 10MB avg)

**Scaling Strategy:**
- Vercel serverless functions auto-scale
- Supabase Postgres connection pooling (pgBouncer)
- Add Redis caching for analytics aggregates (Phase 2)

### Accessibility

**WCAG 2.2 Level AA Compliance:**
- Semantic HTML (header, nav, main, article)
- ARIA labels on interactive elements
- Keyboard navigation (Tab, Enter, Esc)
- Focus indicators (visible outline on focus)
- Color contrast ratio ≥4.5:1 (text) and ≥3:1 (UI components)
- Screen reader testing (NVDA, VoiceOver)
- Alt text for images, aria-label for icons

**Testing:**
- Lighthouse accessibility score ≥95
- Axe DevTools automated testing
- Manual keyboard navigation testing

### Security

#### Authentication & Authorization
- Clerk JWT validation on all protected endpoints
- User can only access their own follow-ups
- Admin role for company library management

#### Data Protection
- HTTPS only (enforced by Vercel)
- Secure JWT storage (httpOnly cookies for sessions)
- CORS configuration (whitelist frontend domain)
- Rate limiting: 100 req/min per user (express-rate-limit)
- Input sanitization (Zod validation, DOMPurify for HTML)

#### File Upload Security
- File type validation (magic number checking, not just extension)
- Malware scanning (ClamAV integration recommended for Phase 2)
- Signed URLs for file downloads (Supabase generates expiring URLs)
- Storage bucket access control (private by default, public via signed URLs)

#### Analytics Privacy
- No PII stored (IP addresses hashed via SHA-256)
- GDPR compliance: Data retention 12 months, user can request deletion
- No 3rd party tracking cookies
- Transparent disclosure on follow-up pages ("This page tracks engagement")

### Monitoring & Observability

#### Application Monitoring
- **Error Tracking:** Sentry (backend + frontend errors)
- **Performance:** Vercel Analytics (Core Web Vitals)
- **Uptime:** Vercel status page
- **Logs:** Vercel logs (structured JSON)

#### Metrics to Track
- Follow-up creation time (P50, P95)
- API error rates (by endpoint)
- Database query performance (slow query log)
- File upload success rate
- Auto-save success rate

#### Alerts
- Error rate >1% (Sentry)
- API latency >1s P95 (custom)
- Database connection failures

---

## Testing Strategy

### Test Coverage Target
**Overall: >80% code coverage**

### Unit Tests (Vitest)
**Backend:**
- Business logic functions (slug generation, URL validation)
- Data validation (Zod schemas)
- Analytics aggregation logic
- File upload processing

**Frontend:**
- Form validation logic
- Auto-save debouncing
- Analytics event generation
- URL slug formatting

**Target:** 90%+ coverage for business logic

### Integration Tests (Vitest + Supertest)
**API Tests:**
- CRUD operations for follow-ups
- File upload and download
- Analytics tracking and retrieval
- Authentication middleware
- Error handling (400, 401, 403, 404, 500)

**Database Tests:**
- Prisma queries with test database
- Transaction handling
- Constraint validation

**Target:** 80%+ coverage for API routes

### End-to-End Tests (Playwright)
**Critical User Flows:**
1. Sign up → Create follow-up → Publish → View as prospect
2. Draft auto-save → Navigate away → Return → Continue editing
3. Upload file → Publish → Prospect downloads file → Analytics tracked
4. Edit published follow-up → Changes appear immediately
5. View analytics dashboard → Verify metrics

**Target:** 100% coverage for P0 workflows

### Performance Tests
- Lighthouse CI (automated on PR)
- Load testing (Artillery.io): 100 concurrent users creating follow-ups
- Database query performance (pg_stat_statements)

---

## Error Handling

### Frontend Error Strategy
- **Network Errors:** Retry 3x with exponential backoff, show toast notification
- **Validation Errors:** Inline form validation, highlight fields
- **Auto-Save Failures:** Show persistent banner, allow manual retry
- **File Upload Failures:** Show progress, retry failed chunks

### Backend Error Strategy
- **Structured Error Responses:**
```json
{
  "error": {
    "code": "SLUG_ALREADY_EXISTS",
    "message": "URL slug already in use",
    "details": {"suggested_slug": "acme-corp-jan-27-2026-2"}
  }
}
```

- **Error Codes:**
  - `UNAUTHORIZED` (401)
  - `FORBIDDEN` (403)
  - `NOT_FOUND` (404)
  - `VALIDATION_ERROR` (400)
  - `SLUG_ALREADY_EXISTS` (409)
  - `FILE_TOO_LARGE` (413)
  - `RATE_LIMIT_EXCEEDED` (429)
  - `INTERNAL_ERROR` (500)

---

## Deployment Strategy

### Environments

| Environment | Purpose | URL | Database |
|-------------|---------|-----|----------|
| **Development** | Local dev | localhost:3000 | Local Postgres |
| **Staging** | Pre-production testing | staging.yourcompany.com | Supabase staging |
| **Production** | Live system | yourcompany.com | Supabase production |

### CI/CD Pipeline (GitHub Actions)

**On Pull Request:**
1. Lint (ESLint + Prettier)
2. Type check (TypeScript)
3. Unit tests (Vitest)
4. Integration tests (Vitest + Supertest)
5. E2E tests (Playwright on staging preview)
6. Lighthouse CI (performance audit)
7. Deploy preview to Vercel (automatic)

**On Merge to Main:**
1. Run all PR checks
2. Deploy to staging (Vercel)
3. Run smoke tests on staging
4. Manual approval gate
5. Deploy to production (Vercel)
6. Run production smoke tests

### Database Migrations

**Tool:** Prisma Migrate

**Process:**
1. Create migration: `npx prisma migrate dev --name add_analytics_table`
2. Review generated SQL
3. Test on local database
4. Apply to staging: `npx prisma migrate deploy`
5. Verify staging data integrity
6. Apply to production: `npx prisma migrate deploy`

### Rollback Strategy
- Vercel instant rollback (previous deployment)
- Database migrations: Write reversible migrations (up/down)
- Feature flags: Disable features without deployment (LaunchDarkly or custom)

---

## Technical Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Auto-save conflicts** (2 users edit same draft simultaneously) | Medium | Low | Last-write-wins for MVP, add optimistic locking in Phase 2 |
| **File storage costs** exceed budget | Medium | Medium | Implement storage quotas, lifecycle policies (delete after 12mo) |
| **Analytics data volume** slows queries | High | Medium | Pre-aggregate data nightly, move raw events to archive table |
| **URL slug collisions** create bad UX | Low | Low | Suggest incrementing slug (-2, -3), allow manual editing |
| **Rich text XSS vulnerability** | High | Low | Sanitize HTML with DOMPurify, use CSP headers |
| **Vercel cold start latency** affects auto-save | Medium | Low | Keep-alive ping, consider serverful option for API if needed |

---

## Development Phases

### Phase 1: MVP (Weeks 1-8)

**Week 1-2: Setup & Foundation**
- Project scaffolding (monorepo, TypeScript, Prisma)
- Database schema design and initial migration
- Authentication integration (Clerk)
- CI/CD pipeline setup

**Week 3-4: Core Backend**
- CRUD API for follow-ups
- File upload to Supabase Storage
- Template system
- Company content library

**Week 5-6: Core Frontend**
- Creator dashboard (list, create, edit)
- Follow-up form with rich text editor
- Draft auto-save
- Public follow-up page

**Week 7: Analytics**
- Analytics tracking endpoint
- Analytics aggregation queries
- Analytics dashboard UI

**Week 8: Polish & Testing**
- E2E tests for critical flows
- Performance optimization
- Accessibility audit
- Bug fixes

### Phase 2: Enhanced Features (Weeks 9-12)
- Advanced analytics (heatmaps, scroll depth)
- Password protection
- Key participants section
- Email integration

---

## Open Technical Questions

| Question | Status | Decision |
|----------|--------|----------|
| Should we use server-side rendering (SSR) for public follow-up pages to improve SEO? | Open | Recommend: Yes, use Next.js instead of Vite for SSR |
| Do we need real-time analytics updates (WebSocket) or is polling sufficient? | Open | Polling (1-min interval) sufficient for MVP |
| Should analytics events be processed asynchronously (message queue)? | Open | Direct DB writes for MVP, add queue (BullMQ) if >1M events/month |
| Cache strategy for company library content? | Open | Use React Query cache (5 min), add Redis in Phase 2 |

---

## Dependencies & Constraints

### External Service Dependencies
- **Clerk:** User authentication (SLA: 99.9% uptime)
- **Supabase:** Database + Storage (SLA: 99.95% uptime)
- **Vercel:** Hosting + CDN (SLA: 99.99% uptime)

### Technical Constraints
- **File Size Limit:** 10MB per file (Supabase Storage free tier: 1GB)
- **Database Connections:** 60 max (Supabase free tier)
- **Vercel Function Timeout:** 10s (hobby plan), 60s (pro plan)
- **Vercel Build Minutes:** 100/month (hobby), unlimited (pro)

### Required Resources
- **Development:** 2 full-stack engineers, 1 designer
- **Infrastructure Costs (monthly estimates):**
  - Supabase Pro: $25/month
  - Vercel Pro: $20/month
  - Clerk Startup: $25/month
  - Sentry Team: $26/month
  - **Total:** ~$96/month for MVP

---

## Appendix: Technology Justifications

### Why React + Express?
- **Maturity:** Large ecosystem, proven at scale
- **Hiring:** Easier to find React developers
- **Flexibility:** Separate frontend/backend allows independent scaling
- **TypeScript:** End-to-end type safety

### Why PostgreSQL?
- **Relational Model:** Follow-ups have structured relationships
- **JSONB:** Flexibility for nested data (next steps, contacts)
- **Performance:** Excellent for complex analytics queries
- **Prisma:** Best-in-class TypeScript ORM for Postgres

### Why Supabase?
- **All-in-One:** Database + storage + auth (chose Clerk for auth instead)
- **DX:** Great developer experience, instant APIs
- **Cost:** Free tier sufficient for early MVP testing
- **Migration Path:** Easy to move to AWS RDS later if needed

### Why Vercel?
- **React/Next.js:** Optimized for React deployments
- **Edge Network:** Global CDN for fast page loads
- **Serverless:** Auto-scaling, pay-per-use
- **DX:** Git-based deployments, instant previews

### Why Custom Analytics?
- **Privacy:** No 3rd party cookies, GDPR-compliant by design
- **Control:** Full customization of tracked events
- **Cost:** No per-event pricing (Google Analytics 360 expensive)
- **Performance:** No external script loading

---

**Document Version**
- v1.0 (2026-01-27): Initial technical specification
