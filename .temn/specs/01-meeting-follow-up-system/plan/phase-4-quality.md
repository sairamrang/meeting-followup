# Phase 4: Quality & Non-Functional Requirements

Spec: [Testing Strategy](../spec-technical.md#testing-strategy) | [NFRs](../spec-technical.md#non-functional-requirements)

**Dependencies:** Phases 1-3 completed ✓

---

## Task 4.1: Backend Unit Tests (think hard) {#task-41}

**File:** `packages/backend/tests/unit/` (multiple test files)

- [ ] Test slug-service: generation, sanitization, collision handling
- [ ] Test file-service: file validation, type checking, size limits
- [ ] Test analytics-service: aggregation logic, metric calculations
- [ ] Test Zod schemas: valid/invalid inputs, error messages
- [ ] Test error-handler: error code mapping, status codes
- [ ] Target: 90%+ coverage for business logic
- [ ] Run with: `npm run test:unit -- --coverage`
- [ ] Use Vitest with happy path + error cases

**Acceptance Mapping:** Quality standard (>80% coverage)

---

## Task 4.2: Backend Integration Tests (ultrathink) {#task-42}

**File:** `packages/backend/tests/integration/routes/` (test each endpoint)

- [ ] Test POST /api/followups: create, validation, auth
- [ ] Test GET /api/followups/:id: retrieve, ownership check, 404
- [ ] Test PATCH /api/followups/:id: update, partial updates, timestamp
- [ ] Test DELETE /api/followups/:id: only draft deletion, file cleanup
- [ ] Test POST /api/followups/:id/publish: slug conflict, uniqueness, published_at
- [ ] Test POST /api/followups/:id/files: upload, validation, storage
- [ ] Test GET /api/followups/:id/analytics: aggregation, 1s response time
- [ ] Test POST /api/analytics/track: public endpoint, event tracking
- [ ] Test error cases: 400 (validation), 401 (auth), 403 (permission), 404 (not found), 409 (conflict)
- [ ] Use Supertest + test database
- [ ] Target: 80%+ coverage for API routes
- [ ] Run with: `npm run test:integration`

**Risk:** Integration tests must use isolated test DB. Use Docker container for PostgreSQL.

**Acceptance Mapping:** All 8 ACs (every endpoint tested)

---

## Task 4.3: Frontend Unit Tests {#task-43}

**Files:** `packages/frontend/tests/unit/` (multiple test files)

- [ ] Test Zustand stores: state mutations, selectors, async actions
- [ ] Test form validation: schema validation, field errors
- [ ] Test utility functions: slug generation, file validation, clipboard
- [ ] Test custom hooks: useAutoSave debounce timing, useRetry backoff
- [ ] Test analytics event generation: event creation, session tracking
- [ ] Use Vitest + React Testing Library
- [ ] Target: 85%+ coverage for business logic

**Acceptance Mapping:** Quality standard (>80% coverage)

---

## Task 4.4: Frontend Component Tests (think hard) {#task-44}

**Files:** `packages/frontend/tests/components/` (test each component)

- [ ] Test FollowUpForm: field rendering, validation, submission
- [ ] Test PublicFollowUp: data fetching, section rendering, scroll tracking
- [ ] Test AnalyticsDashboard: metric display, refresh, loading states
- [ ] Test MyFollowUps: sorting, filtering, pagination
- [ ] Test TemplateSelector: template selection, rendering
- [ ] Test navigation: link rendering, active states, badge updates
- [ ] Use React Testing Library (user-centric)
- [ ] Target: 80%+ coverage for components
- [ ] Mock API responses with MSW (Mock Service Worker)

**Acceptance Mapping:** All user workflows covered (AC-001-008)

---

## Task 4.5: End-to-End Tests (Playwright) - Critical Flows {#task-45}

**File:** `packages/frontend/tests/e2e/` (multiple .spec.ts files)

- [ ] Flow 1: Sign up → Create follow-up (blank) → Publish → View as prospect
  - [ ] Start create flow
  - [ ] Fill form (title, date, company, recap, next steps)
  - [ ] Upload file
  - [ ] Publish
  - [ ] Verify public URL works
  - [ ] Verify all sections render

- [ ] Flow 2: Create draft → Auto-save → Leave page → Return → Continue editing
  - [ ] Start follow-up
  - [ ] Edit field
  - [ ] Wait 35 seconds (trigger auto-save)
  - [ ] Verify "Saved" indicator
  - [ ] Reload page
  - [ ] Verify data persisted

- [ ] Flow 3: Upload file → Download → Verify analytics tracked
  - [ ] Create follow-up with file upload
  - [ ] Publish
  - [ ] As prospect: download file
  - [ ] Creator: view analytics → verify download tracked

- [ ] Flow 4: Create from template → See pre-populated content
  - [ ] Select "Sales Meeting" template
  - [ ] Verify form pre-filled
  - [ ] Verify template structure present

- [ ] Flow 5: Insert library item → Override → Update doesn't affect
  - [ ] Create follow-up
  - [ ] Insert "Our Value Prop" from library
  - [ ] Edit library item as admin
  - [ ] Creator follow-up: verify not updated (local override)

- [ ] Run with: `npm run test:e2e`
- [ ] Use Playwright headless browser
- [ ] Target: 100% coverage for P0 workflows

**Risk:** E2E tests fragile if selectors change. Use data-testid attributes.

**Acceptance Mapping:** All 8 ACs + Workflow 1-5 from spec

---

## Task 4.6: Performance Benchmarking {#task-46}

**Files:**
- `packages/frontend/tests/performance/lighthouse.config.js`
- `packages/backend/tests/performance/load-test.yml`

- [ ] Frontend Lighthouse CI:
  - [ ] Configure on PR (automated with GitHub Actions)
  - [ ] Target: Performance ≥95, Accessibility ≥95
  - [ ] Fail on regress >5 points

- [ ] Backend load testing (Artillery):
  - [ ] Simulate 100 concurrent users creating follow-ups
  - [ ] Measure: API response time P95, error rate, throughput
  - [ ] Target: P95 <500ms, error rate <1%

- [ ] Database query performance:
  - [ ] Enable Postgres slow query log (>100ms)
  - [ ] Review analytics aggregation queries
  - [ ] Target: <1s for analytics aggregates

**Acceptance Mapping:** Performance NFRs

---

## Task 4.7: Security Testing {#task-47}

**File:** `packages/backend/tests/security/`

- [ ] Test input sanitization:
  - [ ] Attempt SQL injection in form fields
  - [ ] Attempt XSS in rich text editor
  - [ ] Verify DOMPurify removes malicious HTML

- [ ] Test authentication:
  - [ ] Missing/expired JWT → 401
  - [ ] Invalid JWT signature → 401
  - [ ] Accessing other user's follow-up → 403

- [ ] Test file upload security:
  - [ ] Upload .exe file with PDF extension → rejected
  - [ ] Upload 100MB file → rejected (>10MB)
  - [ ] Verify uploaded files not executable

- [ ] Test rate limiting:
  - [ ] >100 requests/min from one IP → 429

- [ ] Run OWASP ZAP or similar security scanner

**Acceptance Mapping:** Security requirements (OWASP Top 10)

---

## Task 4.8: Accessibility Audit (WCAG 2.2 AA) {#task-48}

**Files:**
- `packages/frontend/tests/a11y/axe.test.ts`
- `packages/frontend/tests/a11y/keyboard.test.ts`
- `packages/frontend/tests/a11y/screenreader.test.ts`

- [ ] Automated axe-core testing:
  - [ ] Run on all pages
  - [ ] Target: 0 critical/serious issues
  - [ ] Fix color contrast (≥4.5:1 for text)
  - [ ] Fix missing alt text on images

- [ ] Keyboard navigation:
  - [ ] Tab through all form fields
  - [ ] Enter/Space activate buttons
  - [ ] Esc closes modals
  - [ ] Focus visible on all elements

- [ ] Screen reader testing (VoiceOver/NVDA):
  - [ ] Form labels announced correctly
  - [ ] Error messages announced
  - [ ] Headings structure correct (h1→h2→h3)
  - [ ] Links have descriptive text

- [ ] Mobile touch targets:
  - [ ] All buttons ≥44px (min touch target)

**Acceptance Mapping:** AC-007 (mobile responsiveness), accessibility standard

---

## Task 4.9: Error Handling & Negative Test Cases {#task-49}

**File:** `packages/backend/tests/integration/error-cases.test.ts` + frontend

- [ ] Network errors:
  - [ ] Connection timeout → show retry prompt
  - [ ] No internet → offline mode

- [ ] Validation errors:
  - [ ] Submit form with empty required field → show error inline
  - [ ] Enter invalid date → show error
  - [ ] Upload oversized file → show error + clear input

- [ ] Business logic errors:
  - [ ] Publish with duplicate slug → suggest alternative
  - [ ] Edit already deleted follow-up → 404 error
  - [ ] Delete draft then try to continue editing → error

- [ ] User experience errors:
  - [ ] Show user-friendly messages (no stack traces)
  - [ ] Provide recovery actions (retry, go back)

**Acceptance Mapping:** Error handling strategy

---

## Task 4.10: Analytics Data Validation {#task-410}

**File:** `packages/backend/tests/analytics/`

- [ ] Test event tracking:
  - [ ] Page view event recorded correctly
  - [ ] Section view event records section name
  - [ ] File download event records file ID

- [ ] Test aggregation:
  - [ ] total_views = count of all events for followup
  - [ ] unique_visitors = distinct session_ids
  - [ ] avg_time_on_page = sum(page_duration) / count(sessions)

- [ ] Test privacy:
  - [ ] IP addresses hashed in DB (not raw IPs)
  - [ ] No PII stored (names, emails excluded)

- [ ] Test data retention:
  - [ ] 12-month retention policy configured
  - [ ] Cleanup job deletes >12mo old data

**Acceptance Mapping:** BR-006 (analytics privacy)

---

## Task 4.11: Monitoring & Alerts Setup {#task-411}

**Files:**
- `packages/backend/.sentryrc.json`
- Infrastructure config (Vercel, Supabase)

- [ ] Configure Sentry:
  - [ ] Backend error tracking (all exceptions)
  - [ ] Frontend error tracking (React errors, network failures)
  - [ ] Source maps uploaded for debugging
  - [ ] Alert on >1% error rate

- [ ] Configure Vercel Analytics:
  - [ ] Core Web Vitals tracking (LCP, FID, CLS)
  - [ ] Page load performance
  - [ ] Alert if P95 >3s

- [ ] Database monitoring:
  - [ ] Slow query log (>100ms)
  - [ ] Connection pool exhaustion alert

- [ ] Uptime monitoring:
  - [ ] Ping critical endpoints every 5 minutes
  - [ ] Alert if down >5 minutes

**Acceptance Mapping:** Monitoring NFR

---

## Task 4.12: Documentation & Runbooks {#task-412}

**Files:**
- `packages/backend/README.md` (API docs)
- `packages/frontend/README.md` (component docs)
- `docs/RUNBOOK.md` (operations)
- `docs/TROUBLESHOOTING.md`

- [ ] API documentation:
  - [ ] Document all 10+ endpoints (OpenAPI)
  - [ ] Include examples, error codes, auth requirements
  - [ ] Host Swagger UI at /api/docs

- [ ] Component documentation:
  - [ ] Storybook for UI components (optional but recommended)
  - [ ] Props, usage examples, variations

- [ ] Runbook for operators:
  - [ ] How to deploy
  - [ ] How to rollback
  - [ ] How to scale
  - [ ] Common troubleshooting steps

**Acceptance Mapping:** Documentation standard

---

**Phase 4 Complete When:**
- [x] All 12 tasks completed
- [x] >80% test coverage (backend + frontend)
- [x] All tests passing (unit, integration, E2E)
- [x] Lighthouse score ≥95
- [x] WCAG 2.2 AA compliance verified
- [x] Security scan passing (no high/critical vulnerabilities)
- [x] Monitoring configured with alerts
- [x] Ready for Phase 5: Analytics & OKR Tracking

**Effort Estimate:** 2 weeks (QA engineer + frontend/backend for security & a11y)

**Handoff to Phase 5:** All critical paths tested, performance & security verified
