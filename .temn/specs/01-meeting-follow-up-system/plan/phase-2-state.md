# Phase 2: State Management Layer

Spec: [State Architecture](../spec-technical.md#api-architecture-pattern) | [API Endpoints](../spec-technical.md#api-endpoints-specification)

**Dependencies:** Phase 1 backend completed ✓

---

## Task 2.1: API Client Service with Axios {#task-21}

**File:** `packages/frontend/src/services/api-client.ts`

- [ ] Configure Axios instance with Clerk auth header interceptor
- [ ] Add request interceptor to inject JWT token from Clerk
- [ ] Add response interceptor for auto-retry on network errors (3x with exponential backoff)
- [ ] Handle 401 (refresh token / redirect to login)
- [ ] Handle 429 (rate limit - show toast, exponential backoff)
- [ ] Add request timeout (30s)
- [ ] Create TypeScript-typed request/response methods (get, post, patch, delete)
- [ ] Unit tests: interceptor logic, retry behavior, error handling

**Acceptance Mapping:** AC-001, AC-002 (creation flow depends on API client)

---

## Task 2.2: Zustand Store - FollowUps Store {#task-22}

**File:** `packages/frontend/src/stores/followup-store.ts`

- [ ] State: followups[], currentFollowUp, loading, error
- [ ] Actions: setFollowUps(list), setCurrentFollowUp(followup), setLoading(bool), setError(msg)
- [ ] Async thunks:
  - [ ] fetchFollowUps() - GET /api/followups
  - [ ] getFollowUpDetails(id) - GET /api/followups/:id
  - [ ] createFollowUp(data) - POST /api/followups
  - [ ] updateFollowUp(id, data) - PATCH /api/followups/:id
  - [ ] publishFollowUp(id, slug) - POST /api/followups/:id/publish
  - [ ] deleteFollowUp(id) - DELETE /api/followups/:id
- [ ] Selectors: selectFollowUpById(id), selectPublishedFollowUps(), selectDrafts()
- [ ] Unit tests: state mutations, async actions

**Acceptance Mapping:** AC-001, AC-002 (list management)

---

## Task 2.3: Zustand Store - Drafts Store {#task-23}

**File:** `packages/frontend/src/stores/draft-store.ts`

- [ ] State: drafts[], currentDraftId, autoSaveStatus ('idle'|'saving'|'saved'|'error'), lastSavedAt
- [ ] Actions: setDrafts(list), setCurrentDraft(id), setAutoSaveStatus(status), setLastSaved(timestamp)
- [ ] Async thunks:
  - [ ] fetchDrafts() - GET /api/followups?status=draft
  - [ ] autoSaveDraft(id, fields) - PATCH /api/followups/:id with retry logic
  - [ ] abandonDraft(id) - DELETE /api/followups/:id
- [ ] Auto-save hook with 30s debounce (see Task 2.5)
- [ ] Error recovery: show persistent banner on 3 consecutive failures
- [ ] Unit tests: draft lifecycle, auto-save retry logic

**Risk:** Auto-save timing critical. 30s debounce prevents excessive API calls.

**Acceptance Mapping:** AC-002 (auto-save reliability)

---

## Task 2.4: Zustand Store - Templates & Library {#task-24}

**File:** `packages/frontend/src/stores/content-store.ts`

- [ ] State: templates[], libraryItems[], loading, error
- [ ] Actions: setTemplates(list), setLibraryItems(list), setLoading(bool)
- [ ] Async thunks:
  - [ ] fetchTemplates() - GET /api/templates
  - [ ] fetchLibrary() - GET /api/library
  - [ ] addLibraryItem(type, title, content) - POST /api/library (admin only)
  - [ ] updateLibraryItem(id, content) - PATCH /api/library/:id (admin only)
- [ ] Caching: cache templates/library for 5 minutes (React Query integration in Task 2.6)
- [ ] Selectors: selectTemplateBySlug(slug), selectLibraryItemsByType(type)
- [ ] Unit tests: content fetching, caching logic

**Acceptance Mapping:** AC-001 (template selection)

---

## Task 2.5: Analytics Store & Tracking {#task-25}

**File:** `packages/frontend/src/stores/analytics-store.ts`

- [ ] State: analyticsData, pageMetrics, loading, lastUpdated
- [ ] Actions: setAnalyticsData(data), setPageMetrics(metrics), setLoading(bool)
- [ ] Async thunks:
  - [ ] fetchAnalytics(followup_id) - GET /api/followups/:id/analytics
  - [ ] refreshAnalytics(followup_id) - re-fetch, update lastUpdated
  - [ ] trackEvent(event_type, event_data) - POST /api/analytics/track (public endpoint)
- [ ] Polling: Auto-refresh analytics every 1 minute on dashboard (see Task 3.12)
- [ ] Session tracking: Generate session_id on first visit, persist in localStorage
- [ ] Unit tests: analytics data fetching, polling logic

**Acceptance Mapping:** AC-005 (real-time analytics)

---

## Task 2.6: React Query Integration (Optional, recommended) {#task-26}

**File:** `packages/frontend/src/hooks/useQuery-hooks.ts`

- [ ] Create custom hooks wrapping React Query:
  - [ ] useFollowUps() - fetch user's followups, refetch interval 5min
  - [ ] useFollowUp(id) - fetch single followup, cache key [followup, id]
  - [ ] useTemplates() - fetch templates, stale time 10min
  - [ ] useLibrary() - fetch library items, stale time 10min
  - [ ] useAnalytics(followup_id) - fetch analytics, refetch interval 1min (dashboard only)
- [ ] Configure QueryClient with defaults: staleTime=5min, cacheTime=10min, retry=3
- [ ] Implement error boundaries for query failures
- [ ] Unit tests: cache invalidation, refetch logic

**Acceptance Mapping:** AC-002, AC-005 (data fetching and caching)

---

## Task 2.7: Auto-Save Hook (think hard) {#task-27}

**File:** `packages/frontend/src/hooks/useAutoSave.ts`

- [ ] useAutoSave(draftId, fields, interval=30000) - React hook
- [ ] Detect changes (compare previous fields to current)
- [ ] Debounce API call to interval (30 seconds default)
- [ ] Show "Saving..." indicator during request
- [ ] Show "Saved at X:XX PM" after success
- [ ] On error: show banner, retry max 3 times with exponential backoff
- [ ] Clean up debounce on unmount
- [ ] Unit tests: debounce timing, error retry logic, cleanup

**Risk:** Auto-save is critical UX feature. Test with slow network (throttle in dev tools).

**Acceptance Mapping:** AC-002 (auto-save reliability)

---

## Task 2.8: Error Handling & Network Resilience {#task-28}

**File:** `packages/frontend/src/utils/network-utils.ts`

- [ ] Create retry logic: exponential backoff (1s, 2s, 4s, 8s max)
- [ ] Detect network errors (no internet) vs server errors (5xx)
- [ ] Offline mode: cache data in localStorage for offline access (future)
- [ ] Create useRetry hook for components to handle transient errors
- [ ] Create useNetworkStatus hook to track online/offline
- [ ] Toast notifications for errors (show to user)
- [ ] Unit tests: retry backoff calculations, error classification

**Acceptance Mapping:** All API operations depend on resilience

---

**Phase 2 Complete When:**
- [x] All 8 tasks completed
- [x] API client successfully calling backend endpoints
- [x] All stores initialized and tested
- [x] Auto-save hook debouncing working correctly
- [x] Error handling showing user-friendly messages
- [x] Cache invalidation working on data updates
- [x] Ready for Phase 3: UI Components

**Effort Estimate:** 2 weeks (1 frontend engineer)

**Handoff to Phase 3:** Backend API + Frontend state management fully functional
