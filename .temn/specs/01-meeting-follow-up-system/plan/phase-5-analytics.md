# Phase 5: Analytics & OKR Instrumentation

Spec: [Success Metrics](../spec-functional.md#success-metrics) | [Analytics Strategy](../spec-technical.md#monitoring--observability)

**Dependencies:** Phases 1-4 completed ✓

---

## Task 5.1: OKR 1 - Follow-Up Creation Time (<10 min, 80th percentile) {#task-51}

**Files:**
- `packages/backend/src/analytics/okr-service.ts`
- `packages/frontend/src/hooks/useCreationTimer.ts`

- [ ] Track creation flow start timestamp (click "Create Follow-Up")
- [ ] Track publish timestamp (click "Publish")
- [ ] Calculate duration = publish_time - start_time
- [ ] Store metric in database or analytics service
- [ ] Create Sentry Custom Metric or custom analytics table: `okr_creation_time` (followup_id, duration_seconds, status)
- [ ] Dashboard query: SELECT percentile_cont(0.80) WITHIN GROUP (ORDER BY duration_seconds) FROM okr_creation_time
- [ ] Target: P80 <600 seconds (10 minutes)
- [ ] Export to Datadog/Grafana dashboard (or custom)

**Acceptance Mapping:** Success Metric 1

---

## Task 5.2: OKR 2 - Draft Completion Rate (80%+) {#task-52}

**File:** `packages/backend/src/analytics/okr-service.ts`

- [ ] Track when draft created (POST /api/followups)
- [ ] Track when draft published (POST /api/followups/:id/publish)
- [ ] Track when draft deleted (DELETE /api/followups/:id)
- [ ] Calculate: completed = count(published) / count(created_or_deleted)
- [ ] Create table: `okr_draft_completions` (draft_id, created_at, published_at, deleted_at, status)
- [ ] Dashboard query: COUNT(published_at IS NOT NULL) / COUNT(*) FROM drafts_in_period
- [ ] Target: 80%+ completion rate (measure weekly/monthly)
- [ ] Alert: if <75%, indicate problem with user flow

**Acceptance Mapping:** Success Metric 2

---

## Task 5.3: OKR 3 - Prospect Engagement Rate (40%+) {#task-53}

**File:** `packages/backend/src/analytics/okr-service.ts`

- [ ] Track each published follow-up as "sent" (assume creator shares URL)
- [ ] Count unique visitors from analytics_sessions
- [ ] Calculate: engagement_rate = unique_visitors / followups_sent
- [ ] Create table: `okr_engagement` (followup_id, published_at, unique_visitors, engagement_rate)
- [ ] Dashboard query: SUM(unique_visitors) / COUNT(DISTINCT followup_id) FROM followups WHERE published_at IN [period]
- [ ] Target: 40%+ engagement (compare to 15% email baseline)
- [ ] Track by: meeting_type, company, creator_region

**Acceptance Mapping:** Success Metric 3

---

## Task 5.4: OKR 4 - Time to Next Action (7 days avg) {#task-54}

**File:** `packages/backend/src/analytics/okr-service.ts`

- [ ] Requires CRM integration or manual tracking (OUT OF SCOPE for MVP)
- [ ] For MVP: Create placeholder endpoint POST /api/okr/next-action to receive external data
- [ ] Store in table: `okr_next_actions` (followup_id, action_date, days_to_action)
- [ ] Dashboard: Track but don't block on this metric
- [ ] Plan: Phase 2 will integrate with Salesforce/HubSpot to auto-track

**Acceptance Mapping:** Success Metric 4 (deferred)

---

## Task 5.5: OKR 5 - Mobile Usage (40%+) {#task-55}

**File:** `packages/backend/src/analytics/okr-service.ts`

- [ ] Analytics_sessions already tracks device_type (mobile, tablet, desktop)
- [ ] Calculate: mobile_percentage = COUNT(device='mobile') / COUNT(*) FROM analytics_sessions WHERE published_at IN [period]
- [ ] Create table: `okr_mobile_usage` (period, mobile_count, total_count, mobile_percentage)
- [ ] Dashboard: Track mobile % over time
- [ ] Target: 40%+ of views on mobile

**Acceptance Mapping:** Success Metric 6

---

## Task 5.6: Performance Metrics Tracking {#task-56}

**File:** `packages/backend/src/analytics/performance-service.ts`

- [ ] Create table: `performance_metrics` (timestamp, endpoint, method, response_time_ms, status_code, user_id)
- [ ] Log all API responses with duration
- [ ] Calculate P95 response times:
  - [ ] POST /api/followups: target <500ms
  - [ ] PATCH /api/followups/:id (auto-save): target <200ms
  - [ ] GET /api/followups/:id/analytics: target <1s
- [ ] Create dashboard: response time trends, error rates by endpoint
- [ ] Alert: if P95 >1s on any critical endpoint

**Acceptance Mapping:** Performance NFR

---

## Task 5.7: Business Metrics Dashboard {#task-57}

**File:** `packages/frontend/src/pages/admin/MetricsDashboard.tsx`

- [ ] Admin-only page: `/admin/metrics`
- [ ] Display all OKRs (5.1-5.5):
  - [ ] Creation time: P80 duration, trend chart
  - [ ] Draft completion rate: % over time
  - [ ] Engagement rate: % vs target (40%)
  - [ ] Mobile usage: % over time
  - [ ] Time to action: placeholder for Phase 2

- [ ] Display performance metrics (5.6):
  - [ ] API response times (P50, P95, P99)
  - [ ] Error rates by endpoint
  - [ ] Uptime %

- [ ] Display adoption metrics:
  - [ ] Total follow-ups created
  - [ ] Total published
  - [ ] Daily/weekly active users
  - [ ] Repeat creator %

- [ ] Refresh data every 5 minutes
- [ ] Export metrics as CSV/JSON

**Acceptance Mapping:** All success metrics

---

**Phase 5 Complete When:**
- [x] All 7 tasks completed
- [x] OKR tracking queries implemented and tested
- [x] Metrics dashboard displaying real data
- [x] Alerts configured for target breaches
- [x] Ready for Phase 6: Compliance & Verification

**Effort Estimate:** 1 week (analytics engineer + 1 frontend engineer)

**Handoff to Phase 6:** Complete analytics instrumentation, OKRs measurable
