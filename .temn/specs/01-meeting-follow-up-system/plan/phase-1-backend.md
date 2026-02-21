# Phase 1: Backend API Layer

Spec: [API Endpoints](../spec-technical.md#api-endpoints-specification) | [Database Schema](../spec-technical.md#database-schema) | [Tech Stack](../spec-technical.md#tech-stack)

---

## Task 1.1: Shared TypeScript Types {#task-11}

**File:** `packages/shared/types/followup-types.ts`

- [ ] FollowUp interface (id, user_id, status, slug, title, meeting_date, prospect_company, prospect_contacts)
- [ ] NextStep interface (action, owner: 'us'|'them', deadline, completed)
- [ ] ProspectContact interface (name, role, email)
- [ ] MeetingType enum ('sales', 'partnership', 'demo', 'other')
- [ ] File interface (id, filename, file_size, mime_type, storage_url)

**Acceptance Mapping:** AC-001 (creation flow depends on typed data)

---

## Task 1.2: Template & Library Types {#task-12}

**File:** `packages/shared/types/library-types.ts`

- [ ] Template interface (id, name, slug, description, structure: Record)
- [ ] LibraryItem interface (id, type, title, content, created_by, created_at, updated_at)
- [ ] LibraryItemType enum ('about_us', 'value_prop', 'case_study', 'team_bio')
- [ ] Company content library response schemas

**Acceptance Mapping:** AC-001 (templates used in creation)

---

## Task 1.3: Analytics Types {#task-13}

**File:** `packages/shared/types/analytics-types.ts`

- [ ] AnalyticsEvent interface (id, followup_id, session_id, event_type, event_data, device_type, browser, location)
- [ ] EventType enum ('page_view', 'section_view', 'file_download', 'link_click')
- [ ] AnalyticsSummary interface (total_views, unique_visitors, first_viewed_at, last_viewed_at, avg_time_on_page)
- [ ] SectionEngagement interface (section_name, view_percentage, scroll_depth)

**Acceptance Mapping:** AC-005, AC-006 (analytics tracking types)

---

## Task 1.4: Prisma Schema & Migrations (think harder) {#task-14}

**Files:**
- `packages/backend/prisma/schema.prisma`
- `packages/backend/prisma/migrations/001_init.sql`

- [ ] Define followups table with enum status, UNIQUE slug, FK user_id
- [ ] Define files table with FK followup_id, storage_path, storage_url
- [ ] Define templates table with structure JSONB
- [ ] Define library table with content JSONB, created_by FK
- [ ] Define analytics_events table with jsonb event_data, indexed by followup_id + timestamp
- [ ] Define analytics_sessions table with aggregated metrics
- [ ] Create indexes on slug, user_id, status, followup_id+timestamp for analytics
- [ ] Generate migration SQL, test on local PostgreSQL

**Risk:** Migrations must be reversible. Test rollback on local env first.

**Acceptance Mapping:** AC-002 (auto-save depends on DB schema)

---

## Task 1.5: Zod Validation Schemas {#task-15}

**File:** `packages/shared/validation/followup-schemas.ts`

- [ ] CreateFollowUpSchema (title, meeting_date, prospect_company, prospect_contacts, meeting_type)
- [ ] PublishFollowUpSchema (slug validation: alphanumeric-dash, 5-50 chars, unique check)
- [ ] UpdateFollowUpSchema (partial fields: meeting_recap, next_steps, company_content_refs)
- [ ] CreateNextStepSchema (action required, owner in ['us','them'], deadline future date)
- [ ] FileUploadSchema (mime_type whitelist, max 10MB)

**Note:** Schemas used in both backend validation and frontend form validation.

---

## Task 1.6: Backend Service - Slug Generation (think hard) {#task-16}

**File:** `packages/backend/services/slug-service.ts`

- [ ] generateSlug(title, date, company): string → e.g., 'acme-corp-jan-27-2026'
- [ ] sanitizeSlug(input): remove special chars, lowercase, replace spaces with dashes
- [ ] checkSlugUniqueness(slug, exclude_id?): async boolean → query DB
- [ ] suggestAlternateSlug(base_slug): async string → append -2, -3 if conflict (BR-001)
- [ ] Unit tests: collision handling, special character sanitization

**Acceptance Mapping:** AC-003 (URL uniqueness validation)

---

## Task 1.7: Backend Service - File Upload & Storage (think hard) {#task-17}

**File:** `packages/backend/services/file-service.ts` + Multer middleware

- [ ] validateFileType(file): check magic numbers (not just extension)
- [ ] validateFileSize(file): enforce 10MB max per file, 10 files/followup max
- [ ] uploadToSupabase(file, followup_id): use Supabase Storage SDK, return signed URL
- [ ] generateSignedUrl(storage_path, expiry): 24hr expiring download link
- [ ] deleteFile(storage_path): cleanup on followup delete
- [ ] Unit tests: file validation, storage path generation

**Risk:** File type validation critical for security. Test with spoofed MIME types.

---

## Task 1.8: Backend Service - Analytics Aggregation {#task-18}

**File:** `packages/backend/services/analytics-service.ts`

- [ ] aggregateSessionMetrics(followup_id, time_range): compute total_views, unique_visitors, avg_time_on_page
- [ ] getSectionEngagement(followup_id): % of sessions that viewed each section
- [ ] getResourceStats(followup_id): downloads per file, clicks per link
- [ ] getDeviceAndLocationStats(followup_id): device breakdown, top locations
- [ ] Query optimization: use analytics_sessions pre-aggregated table for P95 <1s response

**Acceptance Mapping:** AC-005 (analytics aggregation within 1 minute)

---

## Task 1.9: Express Setup & Middleware {#task-19}

**File:** `packages/backend/src/app.ts`

- [ ] Initialize Express app with TypeScript
- [ ] CORS middleware (whitelist frontend URL)
- [ ] Clerk JWT authentication middleware (validate Authorization header)
- [ ] Rate limiting middleware (100 req/min per user)
- [ ] Request logging (structured JSON logs)
- [ ] Error handling middleware (catch all errors, return structured response)
- [ ] Trust proxy (for Vercel environment)

**Acceptance Mapping:** All API endpoints depend on this setup

---

## Task 1.10: CRUD API Endpoints (ultrathink) {#task-110}

**File:** `packages/backend/src/routes/followups.ts`

- [ ] POST /api/followups (create draft) - validate with schema, save to DB, return followup
- [ ] GET /api/followups/:id (get details) - check auth, return full followup + files
- [ ] PATCH /api/followups/:id (auto-save) - update specific fields, trigger update_at, return updated
- [ ] DELETE /api/followups/:id (delete draft) - check status is draft, delete files from storage, delete DB record
- [ ] POST /api/followups/:id/publish (make public) - validate slug uniqueness, set status=published, set published_at
- [ ] GET /api/followups (list) - return user's followups paginated, sorted by created_at DESC
- [ ] POST /api/followups/:id/files (upload file) - validate file, upload to storage, create DB record
- [ ] GET /api/followups/:id/files/:file_id/download (download) - return signed URL, track download event
- [ ] GET /api/followups/:id/analytics (get analytics) - call analytics service, return aggregated data
- [ ] Integration tests: all happy paths + error cases (400, 401, 403, 404, 409)

**Risk:** Slug uniqueness check must be atomic. Use DB unique constraint + error handling.

**Acceptance Mapping:** AC-001, AC-002, AC-003, AC-004, AC-005, AC-006

---

## Task 1.11: Template & Library Endpoints {#task-111}

**File:** `packages/backend/src/routes/templates.ts` + `packages/backend/src/routes/library.ts`

- [ ] GET /api/templates (list all templates) - no auth required, return all 3 templates
- [ ] GET /api/templates/:id (get template details) - return structure with sample content
- [ ] GET /api/library (get company library items) - no auth required, return all items
- [ ] POST /api/library (add library item) - admin only, validate type, store HTML content, create DB record
- [ ] PATCH /api/library/:id (update library item) - admin only, update content, trigger cascade update to all followups
- [ ] Integration tests: template retrieval, library item lifecycle

**Acceptance Mapping:** AC-001 (template selection in creation flow)

---

## Task 1.12: Public Analytics Tracking Endpoint {#task-112}

**File:** `packages/backend/src/routes/analytics.ts`

- [ ] POST /api/analytics/track (public, no auth) - accept followup_id, session_id, event_type, event_data
- [ ] Validate followup exists and is published
- [ ] Hash IP address (SHA-256) for privacy (BR-006)
- [ ] Extract device_type from user-agent (mobile/tablet/desktop)
- [ ] Lookup location (city/country) from IP using MaxMind GeoIP
- [ ] Insert event into analytics_events table
- [ ] Update or create analytics_sessions record
- [ ] Rate limiting to prevent abuse
- [ ] Return 204 No Content

**Risk:** Analytics scale quickly. Pre-aggregate data nightly to prevent slow queries.

**Acceptance Mapping:** AC-005 (real-time analytics tracking)

---

## Task 1.13: Error Handling & Structured Responses {#task-113}

**File:** `packages/backend/src/utils/error-handler.ts`

- [ ] Create AppError class with code, message, details, statusCode
- [ ] Define error codes: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, SLUG_ALREADY_EXISTS, FILE_TOO_LARGE, RATE_LIMIT_EXCEEDED, INTERNAL_ERROR
- [ ] Middleware to catch all errors and return structured JSON response
- [ ] Log errors to Sentry with context (user_id, request_id, timestamp)
- [ ] Unit tests: error formatting, status code mapping

**Acceptance Mapping:** All API tests depend on consistent error handling

---

## Task 1.14: Backend Testing Setup & Fixtures {#task-114}

**Files:**
- `packages/backend/tests/fixtures/followup-fixtures.ts`
- `packages/backend/tests/setup.ts`

- [ ] Create test database connection (test PostgreSQL container)
- [ ] Write fixtures: 5 sample followups (draft + published), 3 templates, 5 library items
- [ ] Setup Supertest for API testing
- [ ] Seed test DB before each test, cleanup after
- [ ] Mock Supabase Storage for file upload tests
- [ ] Mock Clerk JWT validation for auth tests

**Acceptance Mapping:** All integration tests depend on this setup

---

## Task 1.15: API Documentation (OpenAPI) {#task-115}

**File:** `packages/backend/src/openapi.yaml`

- [ ] Document all 10+ endpoints with request/response schemas
- [ ] Include auth requirements, status codes, error responses
- [ ] Add examples for each endpoint
- [ ] Generate interactive API docs (Swagger UI)
- [ ] Version API docs as living document

**Acceptance Mapping:** Required for frontend integration (AC-001-008)

---

**Phase 1 Complete When:**
- [x] All 15 tasks completed
- [x] Backend tests passing (integration tests with Supertest)
- [x] All API endpoints tested (happy path + errors)
- [x] Prisma migrations reversible and tested
- [x] Error handling consistent across all endpoints
- [x] Ready for Phase 2: State Integration

**Effort Estimate:** 3-4 weeks (1 backend engineer)
