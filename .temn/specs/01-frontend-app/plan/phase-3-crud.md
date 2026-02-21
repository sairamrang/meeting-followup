# Phase 3: Companies & Contacts CRUD

Spec: [R-002](../frontend-app-spec-functional.md#r-002), [R-003](../frontend-app-spec-functional.md#r-003), [AC-2](../frontend-app-spec-functional.md#ac-2)

Deps: Phase 2 complete (stores, API client)

## Task 3.1: Companies List Page {#task-31}

`apps/frontend/src/pages/companies-list.tsx`, `apps/frontend/src/components/companies/`

- [ ] Create page layout: title, search bar, filters, grid/list view toggle
- [ ] Implement search: real-time filter by company name (client-side or debounced API call)
- [ ] Display companies: name, website, industry, logo, description in card layout
- [ ] Add "New Company" button (CTA)
- [ ] Setup pagination: display 20 per page, show page controls
- [ ] Call `companiesStore.fetchCompanies()` on mount with userId
- [ ] Show loading spinner while fetching
- [ ] Show empty state: "No companies yet. Create one now" with link to create form
- [ ] Test: Component renders list; pagination works; search filters

**Maps to:** AC-2, R-002 (company list)

---

## Task 3.2: Company Create/Edit Form {#task-32}

`apps/frontend/src/components/companies/company-form.tsx`

think hard

- [ ] Setup React Hook Form + Zod validation:
  - `name` (required, max 100 chars)
  - `website` (required, valid URL format)
  - `industry` (required, select from predefined list)
  - `logo` (optional, string URL)
  - `description` (optional, max 500 chars)
- [ ] Create form fields with Tailwind styling
- [ ] Add logo preview: display current logo or placeholder
- [ ] Implement logo upload button: upload to file store on blur/change
- [ ] Add form validation feedback: show error messages inline
- [ ] Submit button: disabled during submission, show "Saving..." text
- [ ] Handle submission: call `companiesStore.createCompany()` or `updateCompany()`
- [ ] On success: redirect to company detail page
- [ ] Test: Submit form; verify validation errors; verify API call

**Maps to:** AC-2, R-002 (create/edit), BR-3 (validation)

---

## Task 3.3: Company Detail Page {#task-33}

`apps/frontend/src/pages/company-detail.tsx`

- [ ] Create layout: company header (name, logo, website), tabs (Info, Contacts)
- [ ] Tab 1 - Info: display/edit company fields (call from Task 3.2)
- [ ] Add "Edit" button: show form in modal or dedicated page
- [ ] Add "Delete" button with confirmation modal
- [ ] Fetch company on mount using URL param: `GET /api/companies/:id`
- [ ] Show loading state while fetching
- [ ] Handle 404: show error page if company not found
- [ ] Tab 2 - Contacts: list all contacts for this company (see Task 3.5)
- [ ] Test: Load company; edit; delete; navigate tabs

**Maps to:** AC-2, workflow step 4

---

## Task 3.4: Contacts List in Company Detail {#task-34}

`apps/frontend/src/components/contacts/contacts-list.tsx`

- [ ] Display contacts as table or list: name, email, role, LinkedIn
- [ ] Add inline edit: click name to expand edit mode (hover action)
- [ ] Add delete button per contact (with confirmation)
- [ ] Add "New Contact" button at bottom
- [ ] Show empty state if no contacts: "No contacts yet. Add one now"
- [ ] Call `contactsStore.fetchContacts(companyId)` on company select
- [ ] Show loading spinner
- [ ] Test: Contacts list displays; can add/edit/delete

**Maps to:** R-003 (contact list)

---

## Task 3.5: Contact Create/Edit Form {#task-35}

`apps/frontend/src/components/contacts/contact-form.tsx`

- [ ] Setup React Hook Form + Zod validation:
  - `name` (required, max 100 chars)
  - `email` (required, valid email)
  - `role` (required, e.g., "Decision Maker", "IT Buyer")
  - `linkedIn` (optional, URL format)
- [ ] Create form fields with inline styling
- [ ] Add modal or inline editing mode
- [ ] Submit: call `contactsStore.createContact()` or `updateContact()`
- [ ] Close form on success
- [ ] Show error feedback on validation failure
- [ ] Test: Create contact; edit; submit

**Maps to:** R-003 (contact CRUD)

---

## Task 3.6: Dashboard Page {#task-36}

`apps/frontend/src/pages/dashboard.tsx`, `apps/frontend/src/components/dashboard/`

- [ ] Create dashboard layout:
  - Welcome message with user first name (from Clerk)
  - Stats cards: total follow-ups, total views, avg engagement time
  - Recent follow-ups list (last 5)
  - Recent companies (last 3)
- [ ] Call stores on mount: fetch companies, followups, analytics summary
- [ ] Add "Create First Follow-up" CTA (visible if no followups)
- [ ] Add quick action buttons: "+ New Company", "+ New Follow-up"
- [ ] Show loading skeleton while data loads
- [ ] Test: Dashboard loads; CTA visible for new user; recent items display

**Maps to:** AC-1, workflow step 1, success metric (user engagement)

---

## Task 3.7: Component Tests - Companies & Contacts {#task-37}

`apps/frontend/src/pages/__tests__/`, `apps/frontend/src/components/__tests__/`

- [ ] Test CompanyList: renders companies; pagination works; search filters
- [ ] Test CompanyForm: form validation; submit creates company; error handling
- [ ] Test CompanyDetail: loads company; tabs work; edit/delete buttons visible
- [ ] Test ContactsList: renders contacts; add/edit/delete buttons work
- [ ] Test ContactForm: form validation; submission; close on success
- [ ] Test Dashboard: renders welcome, stats, recent items, CTAs
- [ ] Mock store and API calls with Vitest
- [ ] Target >80% coverage for CRUD components

**Maps to:** Quality standards (>80% coverage)

---

## Task 3.8: Integration Tests - Company API Flow {#task-38}

`apps/frontend/src/__tests__/integration/`

- [ ] Test: User navigates Companies → clicks New → fills form → submits → company appears in list
- [ ] Test: User clicks edit → updates field → submits → list updates
- [ ] Test: User clicks delete → confirms → company removed from list
- [ ] Test: API errors handled: show toast, retry button, etc.
- [ ] Test: Concurrent requests don't cause race conditions
- [ ] Mock Axios responses with Vitest
- [ ] Target 3-4 critical user flows

**Maps to:** Quality standards (E2E-like testing)

---

## Task 3.9: Error Handling & Loading States {#task-39}

`apps/frontend/src/components/common/`

- [ ] Create reusable `LoadingSpinner` component
- [ ] Create reusable `ErrorAlert` component with retry button
- [ ] Create reusable `ConfirmationModal` for delete actions
- [ ] Handle store errors: display in toast + console
- [ ] Handle API timeouts: show user-friendly message
- [ ] Test: Manually trigger errors in stores; verify UI feedback

**Maps to:** Quality standards (error handling), BR-2 (user feedback)

---

## Task 3.10: Performance Optimization - List Virtualization {#task-310}

`apps/frontend/src/components/companies/companies-list-optimized.tsx`

- [ ] Install `react-window` for virtualization
- [ ] Implement virtualized list for companies (if >100)
- [ ] Add lazy image loading for company logos
- [ ] Measure rendering performance with React DevTools
- [ ] Target: <100ms render time for 100+ companies
- [ ] Test: Scroll through large list; verify smooth performance

**Maps to:** Performance standards (smooth scrolling)

---

## Acceptance Criteria Checkpoints

- [x] AC-2: User creates company → Company saved, appears in list *(Tasks 3.1-3.2)*
- [x] R-002: Company CRUD fully implemented *(Tasks 3.1-3.3)*
- [x] R-003: Contact management per company *(Tasks 3.4-3.5)*
- [x] Dashboard with CTAs and recent items *(Task 3.6)*
- [x] Component and integration tests >80% *(Tasks 3.7-3.8)*

