# Phase 6: Public Follow-up Viewer

Spec: [R-008](../frontend-app-spec-functional.md#r-008), [AC-5](../frontend-app-spec-functional.md#ac-5), [Workflow 3](../frontend-app-spec-functional.md#workflow-3-public-viewer-experience)

Deps: Phase 5 complete (published followups)

## Task 6.1: Public Viewer Route & Layout {#task-61}

`apps/frontend/src/pages/public-viewer.tsx`, `apps/frontend/src/components/public/`

- [ ] Create route `/f/:slug` (public, no auth required)
- [ ] Fetch followup by slug: `GET /api/follow-ups/public/{slug}`
- [ ] Show loading state while fetching
- [ ] If not found or unpublished: show 404 page
- [ ] Layout: centered column, clean design
- [ ] Header: company logo (if available), follow-up title, meeting date
- [ ] Content areas: recap, next steps, files (read-only display)
- [ ] Footer: "Created with [logo]" branding
- [ ] Responsive: mobile-first design (320px+)
- [ ] Test: Load published followup; verify content displays

**Maps to:** AC-5 (public access), R-008

---

## Task 6.2: Meeting Recap Display (Read-only Tiptap) {#task-62}

`apps/frontend/src/components/public/recap-display.tsx`

- [ ] Display meeting recap as HTML (rendered from Tiptap JSON)
- [ ] Make Tiptap editor read-only: `editable={false}`
- [ ] Show formatted text: headings, bold, italic, links, lists
- [ ] Preserve all formatting from editor
- [ ] Links open in new tab (`target="_blank"`)
- [ ] No edit capabilities visible
- [ ] Test: Load published followup; verify recap displays; click links

**Maps to:** R-008 (content display)

---

## Task 6.3: Next Steps Display {#task-63}

`apps/frontend/src/components/public/next-steps-display.tsx`

- [ ] Display next steps as list/table:
  - Action description
  - Owner name
  - Deadline (formatted date)
  - Completed checkbox (read-only visual)
- [ ] Visual styling: cards or table format
- [ ] Show "No next steps" if empty
- [ ] Test: Load followup; verify next steps display

**Maps to:** R-008 (next steps display)

---

## Task 6.4: Files Display & Download {#task-64}

`apps/frontend/src/components/public/files-display.tsx`, `apps/frontend/src/lib/file-tracker.ts`

- [ ] Display attached files as list:
  - File name, file type icon, file size
  - Download button per file
- [ ] On download click: track in analytics (see Task 6.6)
- [ ] Call `GET /api/files/{id}/download` (public endpoint)
- [ ] Show "No files attached" if empty
- [ ] File name sanitization: prevent directory traversal
- [ ] Test: Download file; verify tracked

**Maps to:** R-009 (file downloads), success metric (>40% download rate)

---

## Task 6.5: Page View Analytics Tracking {#task-65}

`apps/frontend/src/lib/analytics-tracker.ts`, `apps/frontend/src/hooks/use-page-analytics.ts`

ultrathink

- [ ] On public viewer page load:
  - Create session ID (random UUID)
  - Track page view: `POST /api/analytics/events` with:
    - `followupId`
    - `sessionId`
    - `eventType: "pageView"`
    - `timestamp`
    - `device` (from user-agent parsing)
    - `location` (from IP - backend geoip lookup)
- [ ] Track session start: `POST /api/analytics/sessions/start` with session ID
- [ ] On page unload: track session end: `POST /api/analytics/sessions/end` with duration
- [ ] Track engagement: scroll events → debounce 5s → send engagement event
- [ ] Track file downloads: `POST /api/analytics/events` with `eventType: "download"`
- [ ] No PII collected (analytics privacy: IP hashing by backend)
- [ ] Test: Load page; scroll; download file; verify events logged

**Maps to:** AC-5 (analytics tracking), success metric (engagement)

---

## Task 6.6: Engagement Tracking (Scroll Depth) {#task-66}

`apps/frontend/src/hooks/use-engagement-tracker.ts`

- [ ] On scroll: track scroll depth (0%, 25%, 50%, 75%, 100%)
- [ ] Debounce scroll events (1s)
- [ ] Fire tracking event only once per depth milestone
- [ ] Calculate time on page (from session start to unload)
- [ ] Track which sections viewed (recap, files, etc.)
- [ ] Test: Scroll through page; verify events tracked per milestone

**Maps to:** success metric (>3 min session duration)

---

## Task 6.7: Security - No Auth Required + Read-Only {#task-67}

`apps/frontend/src/components/public/`

- [ ] Public viewer: no login required, no auth check
- [ ] All inputs and buttons are read-only (no edit capability)
- [ ] No user data exposed (only published followup content)
- [ ] Links to other pages (sign-in, etc.) shown in footer only
- [ ] Test: Access as anonymous user; verify no auth errors; no edits allowed

**Maps to:** BR-1 (public access), security standards

---

## Task 6.8: Mobile Responsiveness & Performance {#task-68}

`apps/frontend/src/pages/public-viewer.tsx`

- [ ] Test responsive design: 320px, 480px, 768px, 1024px viewports
- [ ] Optimize for 3G connection: lazy load images, minimal JS
- [ ] Measure Core Web Vitals:
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1
- [ ] Reduce bundle size for public page (code split)
- [ ] Optimize image loading: use next-gen formats (WebP)
- [ ] Test: Load page on throttled connection; verify fast load

**Maps to:** Performance standards (<3s load, <2.5s LCP)

---

## Task 6.9: Component Tests - Public Viewer {#task-69}

`apps/frontend/src/components/__tests__/public/`

- [ ] Test PublicViewer: loads followup; displays content
- [ ] Test RecapDisplay: renders HTML; links work
- [ ] Test NextStepsDisplay: renders list; no edit buttons
- [ ] Test FilesDisplay: renders files; download tracked
- [ ] Test AnalyticsTracking: pageView event sent on mount; unload event sent
- [ ] Test EngagementTracking: scroll events tracked; time calculated
- [ ] Mock API calls
- [ ] Target >80% coverage

**Maps to:** Quality standards (>80% coverage)

---

## Task 6.10: Integration Tests - Public Viewer Flow {#task-610}

`apps/frontend/src/__tests__/integration/`

- [ ] Test: Published followup link → page loads → content displays
- [ ] Test: Scroll → engagement tracked
- [ ] Test: Download file → event tracked → API called
- [ ] Test: Unload → session end tracked
- [ ] Test: 404 for unpublished slug
- [ ] Target 4-5 critical flows

**Maps to:** Quality standards (integration testing)

---

## Acceptance Criteria Checkpoints

- [x] AC-5: Prospect visits public URL → Content displays without login, analytics tracked *(Tasks 6.1-6.6)*
- [x] R-008: Public viewer with content display *(Tasks 6.1-6.4)*
- [x] BR-1: Public routes require no auth *(Task 6.7)*
- [x] Analytics tracking integrated *(Tasks 6.5-6.6)*
- [x] Performance optimized for public page *(Task 6.8)*

