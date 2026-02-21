# Phase 7: Analytics Dashboard

Spec: [R-011](../frontend-app-spec-functional.md#r-011), [R-014](../frontend-app-spec-functional.md#r-014), [AC-6](../frontend-app-spec-functional.md#ac-6), [Workflow 2](../frontend-app-spec-functional.md#workflow-2-view-analytics)

Deps: Phase 5 (published followups), Phase 6 (analytics events)

## Task 7.1: Analytics Store (Zustand) {#task-71}

`apps/frontend/src/store/analytics-store.ts`

think hard

- [ ] Create Zustand store with state:
  - `analyticsData: AnalyticsData | null` (API response)
  - `timeRange: "7d" | "30d" | "90d" | "all"`
  - `loading: boolean`
  - `error: string | null`
- [ ] Implement actions:
  - `fetchAnalytics(followupId, timeRange)` - `GET /api/analytics/{followupId}?range={timeRange}`
  - `setTimeRange(range)` - update range, re-fetch analytics
- [ ] Auto-select 7d on first visit
- [ ] Memoize analytics data to prevent unnecessary re-fetches
- [ ] Test: Dispatch actions; verify state updates

**Maps to:** AC-6 (analytics), data flow

---

## Task 7.2: Analytics Dashboard Layout {#task-72}

`apps/frontend/src/pages/analytics-dashboard.tsx`, `apps/frontend/src/components/analytics/`

- [ ] Create dashboard layout:
  - Header: followup title, date published
  - Time range selector: 7d, 30d, 90d, all (buttons or dropdown)
  - KPI cards: total views, unique visitors, avg session duration, view rate
  - Charts area (below)
- [ ] Load analytics on mount: `GET /api/analytics/:id?range=7d`
- [ ] Show loading spinner while fetching
- [ ] Handle errors: show error message + retry button
- [ ] Time range change: re-fetch analytics, update charts
- [ ] Test: Load dashboard; change time range; charts update

**Maps to:** AC-6 (analytics dashboard), R-011

---

## Task 7.3: Views Over Time Chart {#task-73}

`apps/frontend/src/components/analytics/charts/views-chart.tsx`

- [ ] Install Recharts (or Chart.js)
- [ ] Display line or bar chart: X-axis = date, Y-axis = view count
- [ ] Data source: `analyticsData.viewsByDay[]`
- [ ] Show 7 points for 7d, 30 points for 30d, etc.
- [ ] Tooltip on hover: show exact count and date
- [ ] Color: primary blue
- [ ] Responsive: scales to container width
- [ ] Test: Render chart; hover over points; verify data

**Maps to:** AC-6 (views chart)

---

## Task 7.4: Device Types Pie Chart {#task-74}

`apps/frontend/src/components/analytics/charts/device-chart.tsx`

- [ ] Display pie chart: device breakdown (Desktop, Mobile, Tablet)
- [ ] Data source: `analyticsData.deviceBreakdown[]`
- [ ] Show percentage labels on chart
- [ ] Legend below chart: device type, count, percentage
- [ ] Colors: distinct per device type
- [ ] Responsive: scales to container
- [ ] Test: Render chart; verify slices and legend

**Maps to:** AC-6 (device breakdown)

---

## Task 7.5: Geographic Distribution {#task-75}

`apps/frontend/src/components/analytics/charts/geography-chart.tsx`

- [ ] Display world map (optional, can be list if map library too heavy)
- [ ] OR: List view - countries, counts, percentages
- [ ] Data source: `analyticsData.geographyBreakdown[]` (top 10 countries)
- [ ] Sort by count descending
- [ ] Show country flag emoji (optional)
- [ ] Color code: darker = more views
- [ ] Test: Render chart/list; verify country data

**Maps to:** AC-6 (geography analytics)

---

## Task 7.6: KPI Summary Cards {#task-76}

`apps/frontend/src/components/analytics/kpi-cards.tsx`

- [ ] Create 4 cards in grid (responsive):
  - **Total Views:** count with trend indicator (↑/↓)
  - **Unique Visitors:** count with trend
  - **Avg Session Duration:** minutes with trend
  - **View Rate:** percentage (views per published day) with trend
- [ ] Trend calculation: compare current period to previous period
- [ ] Color: green for positive trend, red for negative
- [ ] Show percentage change (e.g., "+15%")
- [ ] Responsive: stack on mobile, grid on desktop
- [ ] Test: Cards render with data; trends calculated

**Maps to:** AC-6 (KPI metrics), success metrics

---

## Task 7.7: Time Range Selector {#task-77}

`apps/frontend/src/components/analytics/time-range-selector.tsx`

- [ ] Create button group: "7d", "30d", "90d", "All"
- [ ] Active button highlighted
- [ ] On click: update store time range (Task 7.1)
- [ ] Analytics refetch with new range
- [ ] Charts update in real-time
- [ ] Test: Click buttons; verify range changes; charts update

**Maps to:** R-014 (time range filters)

---

## Task 7.8: Data Export to CSV {#task-78}

`apps/frontend/src/lib/analytics-export.ts`, `apps/frontend/src/components/analytics/export-button.tsx`

- [ ] Add "Export" button in analytics dashboard
- [ ] Generate CSV with analytics data:
  - Date, views, unique visitors, device breakdown, geography
- [ ] Filename: `analytics-{followupId}-{dateRange}.csv`
- [ ] Trigger download to user's device
- [ ] Test: Click export; verify CSV file generated and downloaded

**Maps to:** User convenience feature

---

## Task 7.9: Component Tests - Analytics {#task-79}

`apps/frontend/src/components/__tests__/analytics/`

- [ ] Test AnalyticsDashboard: loads analytics; time range selector works
- [ ] Test ViewsChart: renders line chart; data displays correctly
- [ ] Test DeviceChart: renders pie chart; legend shows
- [ ] Test GeographyChart: renders list/map; data displays
- [ ] Test KPICards: shows metrics; trends calculated
- [ ] Test TimeRangeSelector: button clicks trigger re-fetch
- [ ] Test ExportButton: CSV generated and downloaded
- [ ] Mock analytics API and store
- [ ] Target >80% coverage

**Maps to:** Quality standards (>80% coverage)

---

## Task 7.10: Performance - Analytics Data Caching {#task-7-10}

`apps/frontend/src/store/analytics-store.ts`, `apps/frontend/src/lib/analytics-cache.ts`

think hard

- [ ] Implement client-side caching: store analytics data in localStorage
- [ ] Cache key: `analytics_{followupId}_{timeRange}`
- [ ] Cache TTL: 5 minutes (re-fetch if older than 5m)
- [ ] On mount: check cache first; use if fresh; otherwise fetch from API
- [ ] Show "Last updated at X" in dashboard
- [ ] Manual refresh button: clear cache + re-fetch
- [ ] Measure performance: should load cached data instantly (<100ms)
- [ ] Test: Load analytics; change followup; switch time range; verify caching

**Maps to:** Performance standards (<2s load time)

---

## Acceptance Criteria Checkpoints

- [x] AC-6: User views analytics → Charts show views, devices, geography *(Tasks 7.2-7.6)*
- [x] R-011: Analytics dashboard per follow-up *(Tasks 7.2, 7.3-7.6)*
- [x] R-014: Time range filters for analytics *(Task 7.7)*
- [x] Caching implemented for performance *(Task 7.10)*

