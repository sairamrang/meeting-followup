# Phase 3: UI Components Layer

Spec: [User Workflows](../spec-functional.md#user-workflows) | [UI Requirements](../spec-functional.md#requirements-by-priority)

**Dependencies:** Phase 1 backend + Phase 2 state completed ✓

---

## Task 3.1: Layout & Navigation Components {#task-31}

**Files:**
- `packages/frontend/src/components/Layout.tsx`
- `packages/frontend/src/components/MainNav.tsx`
- `packages/frontend/src/components/DraftBadge.tsx`

- [ ] MainLayout: header, sidebar nav, main content area, footer
- [ ] MainNav: links to Dashboard, My Follow-Ups, Drafts (with badge), Account
- [ ] DraftBadge: display count of drafts, update when drafts store changes
- [ ] Mobile-responsive nav (hamburger menu on <768px)
- [ ] Active link indicator
- [ ] Component tests: nav rendering, badge updates

**Acceptance Mapping:** AC-001 (navigation context for creation flow)

---

## Task 3.2: Dashboard Page {#task-32}

**File:** `packages/frontend/src/pages/Dashboard.tsx`

- [ ] Hero section: "Create Follow-Up" CTA button
- [ ] Recent follow-ups list (last 5)
- [ ] Statistics: total follow-ups, views this month, engagement rate
- [ ] Quick actions: Start blank, Choose template
- [ ] Loading state while fetching follow-ups
- [ ] Component tests: render, CTA buttons

**Acceptance Mapping:** AC-001 (starting point for creation)

---

## Task 3.3: Follow-Up List Page {#task-33}

**File:** `packages/frontend/src/pages/MyFollowUps.tsx`

- [ ] Table/list view: company, date, URL, view count, last viewed, status
- [ ] Sorting: by recent, most viewed, company, date (sort buttons)
- [ ] Filtering: by date range (date picker), by meeting type (dropdown)
- [ ] Actions per row: View, Edit, Copy Link, View Analytics, Archive
- [ ] Pagination: 20 per page
- [ ] Empty state: "No follow-ups yet. Create your first one!"
- [ ] Loading skeleton
- [ ] Component tests: sorting, filtering, pagination

**Acceptance Mapping:** AC-008 (REQ-008 follow-up list)

---

## Task 3.4: Drafts Page {#task-34}

**File:** `packages/frontend/src/pages/Drafts.tsx`

- [ ] List of draft follow-ups: title, company, last edited timestamp
- [ ] "Continue Editing" button per draft
- [ ] Delete draft with confirmation modal
- [ ] Sort drafts by: most recent (default), oldest, company
- [ ] Badge count in nav updates when drafts added/removed
- [ ] Empty state: "No drafts. Start a new follow-up!"
- [ ] Component tests: draft list, delete confirmation

**Acceptance Mapping:** AC-002 (draft management)

---

## Task 3.5: Template Selection Component (think hard) {#task-35}

**File:** `packages/frontend/src/components/TemplateSelector.tsx`

- [ ] Modal displaying 3 templates: Sales Meeting, Partnership, Demo
- [ ] Card per template with preview of structure
- [ ] "Use This Template" button
- [ ] "Start Blank" option
- [ ] Loading state while fetching templates
- [ ] Component tests: template selection, loading state

**Acceptance Mapping:** AC-001 (template selection in creation)

---

## Task 3.6: Follow-Up Form - Part 1: Header Section (think hard) {#task-36}

**File:** `packages/frontend/src/components/FollowUpForm/HeaderSection.tsx`

- [ ] Form fields (React Hook Form + Zod validation):
  - [ ] Meeting title (text input, required, max 100 chars)
  - [ ] Meeting date (date picker, must be past/today, warn if >30 days ago)
  - [ ] Prospect company (text input, required)
  - [ ] Prospect contacts (repeatable: name, role, email - add/remove buttons)
  - [ ] Meeting type (dropdown: sales, partnership, demo, other)
- [ ] Real-time validation showing errors inline
- [ ] Component tests: form validation, field rendering

**Acceptance Mapping:** AC-001 (form creation)

---

## Task 3.7: Follow-Up Form - Part 2: Rich Text Editor (ultrathink) {#task-37}

**File:** `packages/frontend/src/components/FollowUpForm/RichTextEditor.tsx`

- [ ] Integrate Tiptap editor (React)
- [ ] Toolbar: bold, italic, bullet list, numbered list, h1-h3 headings
- [ ] Placeholder text: "Enter meeting recap..."
- [ ] Character counter (max 5000 chars)
- [ ] Paste from Word - strip formatting
- [ ] Sanitize HTML with DOMPurify (prevent XSS) (BR-006)
- [ ] Auto-save content every 30s (see useAutoSave hook)
- [ ] Component tests: toolbar buttons, sanitization

**Risk:** XSS vulnerability if HTML not sanitized. Use DOMPurify + CSP headers.

**Acceptance Mapping:** AC-001 (meeting recap required)

---

## Task 3.8: Follow-Up Form - Part 3: Next Steps Section {#task-38}

**File:** `packages/frontend/src/components/FollowUpForm/NextStepsSection.tsx`

- [ ] Repeatable next steps list
- [ ] Fields per step: action (text), owner (us/them), deadline (date picker)
- [ ] Add step button
- [ ] Remove step button (with confirmation if >1 step)
- [ ] Deadline validation: must be future date relative to meeting date
- [ ] Mark complete checkbox (for editing existing follow-ups)
- [ ] Component tests: add/remove steps, deadline validation

**Acceptance Mapping:** AC-001 (next steps required)

---

## Task 3.9: Follow-Up Form - Part 4: Company Content Library {#task-39}

**File:** `packages/frontend/src/components/FollowUpForm/LibrarySection.tsx`

- [ ] Display all library items grouped by type (About Us, Value Prop, Case Studies, Team Bios)
- [ ] "Insert" button per item to add to followup
- [ ] Show which items already inserted (highlight/badge)
- [ ] Remove inserted item button
- [ ] Inserted items appear as blocks in editor area (below rich text)
- [ ] Local override option: if user edits inserted item, create local copy (don't auto-update)
- [ ] Component tests: library item insertion, local override

**Acceptance Mapping:** AC-001 (company content insertion)

---

## Task 3.10: Follow-Up Form - Part 5: File Upload {#task-310}

**File:** `packages/frontend/src/components/FollowUpForm/FileUploadSection.tsx`

- [ ] Drag-drop file upload or click to browse
- [ ] File validation: type (PDF, PPTX, DOCX, XLSX, PNG, JPG), size <10MB, max 10 files
- [ ] Show validation errors inline
- [ ] Upload progress bar per file
- [ ] List of uploaded files with remove button
- [ ] Prevent re-uploading same filename
- [ ] Component tests: file validation, upload progress, error handling

**Acceptance Mapping:** AC-006 (resource downloads tracking)

---

## Task 3.11: Follow-Up Form - Complete Form Component {#task-311}

**File:** `packages/frontend/src/components/FollowUpForm/FollowUpForm.tsx`

- [ ] Compose all sections (3.6-3.10) into single form
- [ ] Submit button: "Publish" (for new) or "Save Changes" (for edit)
- [ ] Preview button: open new tab showing public follow-up page
- [ ] Auto-save status indicator (showing "Saving..." and "Saved")
- [ ] Form validation: all required fields present before publish
- [ ] On publish: validate slug uniqueness (call backend)
- [ ] Show success modal with shareable link, copy button
- [ ] Loading state during submit
- [ ] Component tests: form submission, validation, success flow

**Risk:** Form complexity high. Break into smaller components (already done 3.6-3.10).

**Acceptance Mapping:** AC-001, AC-002 (full creation and draft flow)

---

## Task 3.12: Public Follow-Up Page (think hard) {#task-312}

**File:** `packages/frontend/src/pages/PublicFollowUp.tsx`

- [ ] Route: `/followup/:slug` (public, no auth)
- [ ] Fetch followup by slug from backend (public endpoint)
- [ ] Layout sections in order:
  - [ ] Header: title, date, companies/logos
  - [ ] Meeting Recap: render rich text HTML (sanitized)
  - [ ] Company Information: render inserted library items
  - [ ] Next Steps: display action items with owner, deadline (highlight if prospect is "them")
  - [ ] Resources: list downloadable files with download buttons
  - [ ] Footer: contact info
- [ ] Track page view event to analytics (session_id in localStorage)
- [ ] Track section views as user scrolls (Intersection Observer API)
- [ ] Track resource downloads
- [ ] Mobile-responsive (320px width)
- [ ] Print-friendly CSS (hide interactive elements)
- [ ] Component tests: rendering, event tracking

**Acceptance Mapping:** AC-004, AC-005, AC-006, AC-007

---

## Task 3.13: Analytics Dashboard - Overview {#task-313}

**File:** `packages/frontend/src/pages/Analytics.tsx`

- [ ] Fetch analytics for selected followup
- [ ] Display metrics cards:
  - [ ] Total views
  - [ ] Unique visitors
  - [ ] Average time on page (minutes:seconds)
  - [ ] First/last viewed timestamps
- [ ] Loading skeleton
- [ ] Error state: "Analytics not yet available"
- [ ] Auto-refresh every 1 minute (using React Query)
- [ ] Component tests: metric display, refresh timing

**Acceptance Mapping:** AC-005 (analytics dashboard)

---

## Task 3.14: Analytics Dashboard - Section Engagement {#task-314}

**File:** `packages/frontend/src/components/Analytics/SectionEngagement.tsx`

- [ ] Bar chart: % of visitors who viewed each section (Meeting Recap, Next Steps, Resources, etc.)
- [ ] Show sections in order with color-coded bars
- [ ] Hover tooltip: "X% of visitors viewed this section"
- [ ] Use chart library (Chart.js or Recharts)
- [ ] Component tests: chart rendering, data display

**Acceptance Mapping:** AC-005 (section engagement metrics)

---

## Task 3.15: Analytics Dashboard - Resources Stats {#task-315}

**File:** `packages/frontend/src/components/Analytics/ResourceStats.tsx`

- [ ] Table: file/link name, downloads/clicks count
- [ ] Sort by: most downloads, least downloads
- [ ] Show top resources
- [ ] Component tests: data display, sorting

**Acceptance Mapping:** AC-006 (resource tracking)

---

## Task 3.16: Analytics Dashboard - Visitor Demographics {#task-316}

**File:** `packages/frontend/src/components/Analytics/VisitorDemographics.tsx`

- [ ] Device breakdown: mobile, tablet, desktop (pie chart or bars)
- [ ] Top locations: city, country (map or list)
- [ ] Browser breakdown: Chrome, Safari, Firefox, etc.
- [ ] Responsive design for analytics page
- [ ] Component tests: chart rendering

**Acceptance Mapping:** AC-005 (visitor information)

---

## Task 3.17: Edit Published Follow-Up Modal {#task-317}

**File:** `packages/frontend/src/components/EditFollowUpModal.tsx`

- [ ] Modal with same form as create (3.11 FollowUpForm)
- [ ] Pre-populated with published followup data
- [ ] "Save Changes" button (PATCH endpoint)
- [ ] Show "Changes saved" confirmation
- [ ] Disable slug editing (can't change published URL)
- [ ] Component tests: edit flow, confirmation

**Acceptance Mapping:** AC-008 (edit after publish)

---

## Task 3.18: Copy Link to Clipboard {#task-318}

**File:** `packages/frontend/src/utils/clipboard-utils.ts`

- [ ] copyToClipboard(text): string → use navigator.clipboard API
- [ ] Fallback for older browsers
- [ ] Show toast: "Link copied to clipboard"
- [ ] Component: reusable CopyButton component
- [ ] Unit tests: copy logic, fallback

**Acceptance Mapping:** AC-001 (copy shareable link after publish)

---

## Task 3.19: Modal Components (Confirmation, Success) {#task-319}

**Files:**
- `packages/frontend/src/components/ConfirmationModal.tsx`
- `packages/frontend/src/components/SuccessModal.tsx`
- `packages/frontend/src/components/ErrorModal.tsx`

- [ ] ConfirmationModal: title, message, confirm/cancel buttons, dangerous action styling
- [ ] SuccessModal: title, message, close button, optional CTA (e.g., "View Page")
- [ ] ErrorModal: error message, retry button
- [ ] Keyboard accessibility: ESC to close, Tab through buttons
- [ ] Component tests: button actions, keyboard nav

**Acceptance Mapping:** Multiple tasks use these (delete, publish, etc.)

---

## Task 3.20: Toast Notifications {#task-320}

**File:** `packages/frontend/src/components/Toast.tsx`

- [ ] Create toast provider (context)
- [ ] Toast component: message, type (success, error, info), dismiss button
- [ ] Auto-dismiss after 5 seconds (for success), 10 seconds (for errors)
- [ ] Stack multiple toasts
- [ ] useToast hook for components
- [ ] Component tests: toast display, auto-dismiss

**Acceptance Mapping:** Error handling throughout app shows toasts

---

## Task 3.21: Loading & Empty States {#task-321}

**Files:**
- `packages/frontend/src/components/LoadingSkeleton.tsx`
- `packages/frontend/src/components/EmptyState.tsx`

- [ ] LoadingSkeleton: shimmer animation for tables, cards, text blocks
- [ ] EmptyState: illustration, message, CTA button (e.g., "Create your first follow-up")
- [ ] Accessible alt text for illustrations
- [ ] Component tests: rendering, accessibility

**Acceptance Mapping:** Improves UX throughout app

---

## Task 3.22: Form Field Components {#task-322}

**Files:**
- `packages/frontend/src/components/FormFields/TextField.tsx`
- `packages/frontend/src/components/FormFields/TextAreaField.tsx`
- `packages/frontend/src/components/FormFields/DateField.tsx`
- `packages/frontend/src/components/FormFields/SelectField.tsx`

- [ ] Reusable form field components wrapping React Hook Form
- [ ] Built-in error display
- [ ] Labels, placeholders, help text
- [ ] Accessible: aria-label, aria-describedby for errors
- [ ] Component tests: rendering, error display, accessibility

**Acceptance Mapping:** Form validation (AC-001)

---

**Phase 3 Complete When:**
- [x] All 22 tasks completed
- [x] Follow-up creation flow end-to-end working (create → edit → publish)
- [x] Public follow-up page accessible and mobile-responsive
- [x] Analytics dashboard showing real metrics
- [x] All components tested and accessible
- [x] Ready for Phase 4: Quality & Testing

**Effort Estimate:** 4-5 weeks (1-2 frontend engineers)

**Handoff to Phase 4:** Complete UI implemented, all workflows functional
