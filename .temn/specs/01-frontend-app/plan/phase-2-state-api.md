# Phase 2: State Management & API Integration

Spec: [API Integration](../frontend-app-spec-functional.md#dependencies) | [Business Rules](../frontend-app-spec-functional.md#business-rules)

Deps: Phase 1 complete (Axios, Zustand available)

## Task 2.1: Axios HTTP Client Setup {#task-21}

`apps/frontend/src/lib/api-client.ts`, `apps/frontend/src/lib/axios-interceptors.ts`

- [ ] Create Axios instance with base URL from env variable
- [ ] Setup request interceptor: add Clerk auth bearer token via `@clerk/clerk-react`
- [ ] Setup response interceptor: handle 401 (token refresh), 403 (forbidden), 5xx (retry)
- [ ] Implement exponential backoff for retries (max 3 attempts, 1s/2s/4s delays)
- [ ] Create response transformer: extract `data` field from API responses
- [ ] Setup timeout: 30s for normal requests, 60s for file uploads
- [ ] Test: Make sample GET request to API, verify token in header

**Maps to:** BR-2 (auth), quality standards (reliability)

---

## Task 2.2: Shared Types Package Import {#task-22}

`apps/frontend/src/types/`, `packages/shared/` (via npm link)

- [ ] Link `@meeting-followup/shared` package in frontend package.json
- [ ] Create TypeScript paths: `import type { Company } from '@meeting-followup/shared'`
- [ ] Verify shared types available: Company, Contact, FollowUp, Template, Library, File, Analytics
- [ ] Test: `npm run type-check` passes with shared types

**Maps to:** Type safety (strict mode), shared validation

---

## Task 2.3: Companies Store (Zustand) {#task-23}

`apps/frontend/src/store/companies-store.ts`

think hard

- [ ] Create Zustand store with state:
  - `companies: Company[]`
  - `selectedCompany: Company | null`
  - `loading: boolean`
  - `error: string | null`
- [ ] Implement actions:
  - `fetchCompanies(userId)` - GET /api/companies
  - `createCompany(data)` - POST /api/companies
  - `updateCompany(id, data)` - PUT /api/companies/:id
  - `deleteCompany(id)` - DELETE /api/companies/:id
  - `selectCompany(id)` - Set selected company
- [ ] Setup state persistence: save selected company to localStorage
- [ ] Add devtools middleware for debugging
- [ ] Test: Dispatch actions, verify state updates

**Maps to:** AC-2 (company management), data flow

---

## Task 2.4: Contacts Store (Zustand) {#task-24}

`apps/frontend/src/store/contacts-store.ts`

- [ ] Create Zustand store with state:
  - `contacts: Contact[]` (filtered by company)
  - `loading: boolean`
  - `error: string | null`
- [ ] Implement actions:
  - `fetchContacts(companyId)` - GET /api/companies/:id/contacts
  - `createContact(companyId, data)` - POST /api/companies/:id/contacts
  - `updateContact(contactId, data)` - PUT /api/contacts/:id
  - `deleteContact(contactId)` - DELETE /api/contacts/:id
- [ ] Auto-fetch contacts when company selected
- [ ] Test: Fetch contacts for company, verify state

**Maps to:** AC-2, R-003 (contact management)

---

## Task 2.5: Follow-ups Store (Zustand) {#task-25}

`apps/frontend/src/store/followups-store.ts`

think hard

- [ ] Create Zustand store with state:
  - `followups: FollowUp[]`
  - `currentFollowUp: FollowUp | null`
  - `loading: boolean`
  - `error: string | null`
  - `filters: { status, company, dateRange }`
- [ ] Implement actions:
  - `fetchFollowups(userId, filters?)` - GET /api/follow-ups with query params
  - `createFollowup(data)` - POST /api/follow-ups → returns draft
  - `updateFollowup(id, data)` - PUT /api/follow-ups/:id (draft only)
  - `publishFollowup(id, slug)` - POST /api/follow-ups/:id/publish
  - `unpublishFollowup(id)` - POST /api/follow-ups/:id/unpublish
  - `deleteFollowup(id)` - DELETE /api/follow-ups/:id
  - `setFilters(filters)` - Update filter state, re-fetch
- [ ] Setup pagination: limit=20, offset tracking
- [ ] Test: Create, fetch, publish followup in sequence

**Maps to:** AC-3, AC-4, R-007 (publish workflow)

---

## Task 2.6: Auth Store & User Context {#task-26}

`apps/frontend/src/store/auth-store.ts`, `apps/frontend/src/context/auth-context.tsx`

- [ ] Create auth store to expose Clerk user info:
  - `userId: string | null`
  - `user: User | null`
  - `isLoaded: boolean`
- [ ] Create `useUser()` hook that selects from store
- [ ] Setup auth middleware: auto-populate userId in all API calls
- [ ] Sync Clerk user changes to store (setup sessionStorage listener)
- [ ] Test: Sign in user, verify userId in store; sign out, verify cleared

**Maps to:** BR-2 (user-scoped data), AC-1

---

## Acceptance Criteria Checkpoints

- [x] API client configured with auth and retry logic *(Task 2.1)*
- [x] All Zustand stores created with actions *(Tasks 2.3-2.5)*
- [x] Shared types integrated *(Task 2.2)*
- [x] Auth store synced with Clerk *(Task 2.6)*
- [x] API integration layer complete for CRUD

