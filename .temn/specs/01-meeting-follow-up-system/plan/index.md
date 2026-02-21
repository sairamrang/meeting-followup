# Plan: Meeting Follow-Up System

| | |
|---|---|
| **Tasks** | 65 across 6 phases |
| **Specs** | [Functional](../spec-functional.md) / [Technical](../spec-technical.md) |
| **Est. Effort** | 8 weeks (1 full-stack engineer pair) |

## Phases

| Phase | File | Tasks | Focus |
|-------|------|-------|-------|
| 1. Backend | [phase-1-backend.md](./phase-1-backend.md) | 11 | DB schema, API setup, core endpoints |
| 2. State | [phase-2-state.md](./phase-2-state.md) | 8 | Zustand stores, API client, integration |
| 3. UI | [phase-3-ui.md](./phase-3-ui.md) | 22 | Dashboard, forms, public page, analytics UI |
| 4. Quality | [phase-4-quality.md](./phase-4-quality.md) | 12 | Tests, NFRs, accessibility, performance |
| 5. Analytics | [phase-5-analytics.md](./phase-5-analytics.md) | 7 | OKR tracking, monitoring, dashboards |
| 6. Compliance | [phase-6-compliance.md](./phase-6-compliance.md) | 5 | E2E tests, verification, GDPR |

## Critical Path

**Backend Foundation** (Phase 1) → **State Integration** (Phase 2) → **UI Components** (Phase 3) → **Quality Gates** (Phase 4)

Phases 5-6 run in parallel with Phase 4 polish.

## High-Risk Tasks

| Task | Risk | Mitigation |
|------|------|-----------|
| 1.4: Prisma migrations | High | Reversible migrations, staging env test first |
| 3.5: Tiptap rich text XSS | High | DOMPurify sanitization, CSP headers |
| 5.1: Analytics real-time updates | High | 1-min polling sufficient (no WebSocket needed) |
| 4.3: WCAG 2.2 AA compliance | Medium | axe-core automated + manual testing early |

## Success Criteria (MVP Launch)

- [x] All 8 ACs from functional spec passing
- [x] >80% code coverage (backend + frontend)
- [x] Lighthouse score ≥95 (performance)
- [x] All P0 features implemented
- [x] Sentry error tracking configured
- [x] E2E tests cover 5 critical flows

## Key Deliverables

1. **Database:** Prisma schema with 6 tables, migrations
2. **Backend API:** 10 endpoints (CRUD + analytics + library)
3. **Frontend State:** 5 Zustand stores + React Query hooks
4. **UI Components:** 20 React components (forms, dashboards, public pages)
5. **Analytics:** Real-time tracking, aggregation, dashboards
6. **Tests:** Unit (Vitest), integration (Supertest), E2E (Playwright)
7. **Monitoring:** Sentry + Vercel Analytics configured

→ **Start:** [Task 1.1 - Shared Types](./phase-1-backend.md#task-11)

→ **Risks:** See [risks.md](./risks.md)
