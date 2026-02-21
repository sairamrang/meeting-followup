# Plan: Meeting Follow-Up Frontend Application

| | |
|---|---|
| **Tasks** | 87 across 11 phases |
| **Specs** | [functional](../frontend-app-spec-functional.md) / [technical](../frontend-app-spec-technical.md) |

## Phases

| Phase | File | Tasks | Focus |
|-------|------|-------|-------|
| 1. Setup | [phase-1-setup.md](./phase-1-setup.md) | 8 | Vite, Clerk, Router, Layout |
| 2. State & API | [phase-2-state-api.md](./phase-2-state-api.md) | 6 | Zustand stores, Axios client |
| 3. Companies & Contacts CRUD | [phase-3-crud.md](./phase-3-crud.md) | 10 | Company/contact management |
| 4. Follow-up Editor | [phase-4-editor.md](./phase-4-editor.md) | 12 | Templates, Tiptap, auto-save |
| 5. Publish Workflow | [phase-5-publish.md](./phase-5-publish.md) | 8 | Slug validation, publish/unpublish |
| 6. Public Viewer | [phase-6-public-viewer.md](./phase-6-public-viewer.md) | 8 | Public page, analytics tracking |
| 7. Analytics Dashboard | [phase-7-analytics.md](./phase-7-analytics.md) | 10 | Charts, metrics, time filters |
| 8. Library Content | [phase-8-library.md](./phase-8-library.md) | 9 | Browse, insert, management |
| 9. File Uploads | [phase-9-files.md](./phase-9-files.md) | 7 | Dropzone, preview, download |
| 10. Quality & Testing | [phase-10-testing.md](./phase-10-testing.md) | 7 | Unit, component, E2E tests |
| 11. Accessibility & Performance | [phase-11-a11y-perf.md](./phase-11-a11y-perf.md) | 5 | WCAG AA, performance tuning |

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tiptap editor performance with large documents | Medium | Lazy load, virtualization, debounce |
| Clerk auth token refresh edge cases | High | Axios interceptor, retry logic, token refresh |
| Analytics event accumulation at scale | High | Batching, rate limiting, cleanup jobs |
| Zustand state growth complexity | Medium | Modular stores per domain, devtools |
| File upload network timeouts | Medium | Resumable upload, progress tracking |

**→ Start:** [Task 1.1](./phase-1-setup.md#task-11)
