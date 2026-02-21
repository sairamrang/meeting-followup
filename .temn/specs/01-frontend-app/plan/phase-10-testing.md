# Phase 10: Comprehensive Testing

Spec: [Quality Standards](../../../core/standards/quality-standards.md)

Deps: All prior phases complete (all features implemented)

## Task 10.1: Unit Tests - Core Business Logic {#task-101}

`apps/frontend/src/__tests__/unit/`

think hard

- [ ] Test store actions (Zustand):
  - Companies store: fetch, create, update, delete, select
  - Contacts store: CRUD operations
  - FollowUps store: CRUD, publish, unpublish
  - Analytics store: fetch, time range filtering
  - Library store: search, category filter
- [ ] Test API client:
  - Token injection in headers
  - Error handling (401, 403, 5xx)
  - Retry logic (exponential backoff)
  - Timeout behavior
- [ ] Test validation schemas (Zod):
  - Company validation
  - Contact validation
  - FollowUp validation
  - Slug validation
- [ ] Test utility functions:
  - Slug generation
  - Date formatting
  - File size formatting
  - Analytics calculations (trends, percentages)
- [ ] Target: >80% coverage for all utilities

**Maps to:** Quality standards (>80% coverage, >100% critical paths)

---

## Task 10.2: Component Tests - All Major Components {#task-102}

`apps/frontend/src/components/__tests__/`

- [ ] Auth components:
  - ClerkSignIn/SignUp (integration with Clerk)
  - ProtectedRoute (redirect behavior)
- [ ] CRUD components:
  - CompanyList, CompanyForm, CompanyDetail
  - ContactsList, ContactForm
- [ ] Editor components:
  - TiptapEditor (formatting, undo/redo)
  - NextStepsForm (add/remove steps)
  - FileUpload (progress, validation)
  - TemplateSelector
- [ ] Publish workflow:
  - PublishModal (slug validation)
  - FollowupDetail (status display)
  - FollowupsList (filters, pagination)
- [ ] Analytics:
  - AnalyticsDashboard (loading, time range)
  - ViewsChart, DeviceChart, GeographyChart
  - KPICards (trend calculation)
- [ ] Public viewer:
  - PublicViewer (content display)
  - RecapDisplay, NextStepsDisplay, FilesDisplay
- [ ] Target: >80% coverage for all components

**Maps to:** Quality standards (>80% coverage)

---

## Task 10.3: Integration Tests - Critical User Flows {#task-103}

`apps/frontend/src/__tests__/integration/`

- [ ] Flow: Sign up → Create company → Create follow-up → Publish
- [ ] Flow: Edit published follow-up (should fail) → Unpublish → Edit → Re-publish
- [ ] Flow: Add files → Upload → Verify in public viewer
- [ ] Flow: Visit public URL → Track analytics → Check dashboard
- [ ] Flow: Insert library content → Verify in editor
- [ ] Flow: Auto-save every 30s → Verify data persists on reload
- [ ] Flow: API error (5xx) → Retry logic → Success
- [ ] Mock API responses with Vitest
- [ ] Target: 7-8 critical flows fully tested

**Maps to:** Quality standards (integration testing)

---

## Task 10.4: E2E Tests with Playwright {#task-104}

`apps/frontend/e2e/`

ultrathink

- [ ] Setup Playwright configuration
- [ ] Test: New user sign-up flow
  - Navigate to sign-up
  - Fill form with valid email
  - Verify email confirmation (mock)
- [ ] Test: Create and publish follow-up (end-to-end)
  - Sign in
  - Create company
  - Create follow-up with template
  - Add content, files
  - Publish with custom slug
  - Verify public URL accessible
- [ ] Test: Public viewer analytics
  - Open public URL
  - Scroll through page
  - Download file
  - Verify analytics dashboard shows events
- [ ] Test: Responsive layouts
  - Desktop viewport (1920x1080)
  - Tablet viewport (768x1024)
  - Mobile viewport (375x812)
- [ ] Test: Error scenarios
  - Network timeout (simulate with DevTools)
  - 401 unauthorized (invalid token)
  - 404 not found (deleted followup)
- [ ] Target: 5-6 critical E2E flows

**Maps to:** Quality standards (E2E testing), browser support

---

## Task 10.5: Accessibility Tests - WCAG 2.2 AA {#task-105}

`apps/frontend/src/__tests__/accessibility/`

think hard

- [ ] Setup axe-core testing
- [ ] Test all major pages for violations:
  - Dashboard, Companies, Follow-ups, Editor
  - Public Viewer, Analytics
- [ ] Manual testing checklist:
  - Keyboard navigation: Tab, Enter, Escape, Arrow keys work
  - Focus indicators visible on all focusable elements
  - Screen reader testing: NVDA on Windows (or mock)
  - Color contrast: verify 4.5:1 for text, 3:1 for UI
  - Form labels: all inputs labeled
  - Heading structure: h1 → h2 → h3 (no skips)
  - Alt text: all images have alt text
  - Links: all descriptive (not "click here")
  - Zoom: 200% zoom doesn't break layout
  - Responsive: 320px viewport readable
- [ ] Lighthouse audit: score ≥95 for accessibility
- [ ] Create accessibility audit report

**Maps to:** Accessibility standards (WCAG 2.2 AA), quality standards

---

## Task 10.6: Performance & Load Testing {#task-106}

`apps/frontend/src/__tests__/performance/`

- [ ] Measure Core Web Vitals (Lighthouse):
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1
- [ ] Page load time: <3s on 3G connection (DevTools throttling)
- [ ] API response time: <500ms P95 for read operations
- [ ] Auto-save latency: <200ms
- [ ] File upload: <5s for 10MB on 4G
- [ ] Measure bundle size:
  - Main JS bundle: <250KB (after gzip)
  - CSS: <50KB
  - Total: <300KB
- [ ] Use Lighthouse CI or Web Vitals API for continuous monitoring
- [ ] Test on 3G and 4G network profiles

**Maps to:** Performance standards (load time, Core Web Vitals)

---

## Task 10.7: Security & Compliance Tests {#task-107}

`apps/frontend/src/__tests__/security/`

- [ ] Verify no hardcoded secrets in code (grep for API keys)
- [ ] Verify Clerk token sent in all authenticated requests
- [ ] Verify no CORS issues (cross-origin requests allowed)
- [ ] Verify form inputs sanitized (XSS prevention)
- [ ] Verify API errors don't expose sensitive data
- [ ] Verify PII not logged in console
- [ ] Dependency vulnerability scan: `npm audit`
- [ ] Check for deprecated/unsupported packages
- [ ] Verify CSP headers set (backend responsibility, but verify from frontend)

**Maps to:** Security standards, quality standards (zero tolerance for vulnerabilities)

---

## Task 10.8: Test Report & Coverage Summary {#task-108}

`apps/frontend/coverage/`, `apps/frontend/TESTING.md`

- [ ] Generate coverage report: `npm run test:coverage`
- [ ] Verify >80% overall coverage
- [ ] Identify uncovered lines
- [ ] Create `TESTING.md` documenting:
  - How to run tests: `npm run test`, `npm run test:coverage`, `npm run e2e`
  - Test structure and organization
  - How to add new tests
  - Mocking strategies
  - CI/CD integration
- [ ] Create test summary table:
  - Unit tests: X tests, X% coverage
  - Component tests: X tests, X% coverage
  - Integration tests: X tests
  - E2E tests: X tests
  - Accessibility: WCAG 2.2 AA compliant
  - Performance: all metrics <target

**Maps to:** Documentation standards, quality standards

---

## Acceptance Criteria Checkpoints

- [x] >80% overall test coverage *(Tasks 10.1-10.3)*
- [x] E2E tests for critical user flows *(Task 10.4)*
- [x] WCAG 2.2 AA accessibility compliance *(Task 10.5)*
- [x] Performance targets met *(Task 10.6)*
- [x] Security compliance verified *(Task 10.7)*
- [x] All tests documented *(Task 10.8)*

