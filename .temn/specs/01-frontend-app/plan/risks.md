# Risks: Meeting Follow-Up Frontend Application

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|-----------|
| Tiptap editor performance with large documents (5k+ chars) | Medium | Medium | Debounce onChange, virtualization, lazy load extensions |
| Clerk auth token refresh race conditions | High | Low | Axios interceptor with lock mechanism, queue retries |
| Analytics event accumulation at scale (1000+ events/day) | High | Medium | Batch events (10s debounce), server-side cleanup jobs |
| Zustand state grows complex with 6+ stores | Medium | Low | Modular stores per domain, Redux DevTools for debugging |
| File upload network timeout on 3G | Medium | Medium | Resumable upload library, progress tracking, retry |
| Slugification collisions (user-generated slugs) | Low | Low | Backend uniqueness check, queue retry, suffix fallback |
| Bundle size exceeds 300KB (Recharts + Tiptap) | Medium | High | Aggressive code splitting, lazy load charts, tree-shake |
| Public viewer waterfall: metadata → content → analytics | Medium | Medium | Parallel fetch, optimistic rendering, skeleton UI |
| Accessibility audit finds major violations late | High | Low | axe-core in CI, manual testing in Phase 11 |
| Public API rate limiting blocks analytics events | Medium | Low | Client-side batching, exponential backoff, offline queue |
| Form validation mismatch between frontend/backend | Low | Low | Share Zod schemas via @meeting-followup/shared package |
| Mobile viewport (320px) crushes form layouts | Medium | Medium | Mobile-first design, responsive grid, test early |

