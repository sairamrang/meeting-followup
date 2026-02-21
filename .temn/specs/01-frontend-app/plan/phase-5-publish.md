# Phase 5: Publish Workflow & URL Management

Spec: [R-007](../frontend-app-spec-functional.md#r-007), [R-015](../frontend-app-spec-functional.md#r-015), [BR-4](../frontend-app-spec-functional.md#br-4), [BR-5](../frontend-app-spec-functional.md#br-5), [AC-4](../frontend-app-spec-functional.md#ac-4), [AC-5](../frontend-app-spec-functional.md#ac-5), [Workflow 1](../frontend-app-spec-functional.md#workflow-1-create-first-follow-up)

Deps: Phase 4 complete (editor, draft state)

## Task 5.1: Publish Modal - Slug Customization {#task-51}

`apps/frontend/src/components/followup/publish-modal.tsx`

think hard

- [ ] Create modal triggered by "Publish" button in editor
- [ ] Display auto-generated slug (from title or random)
- [ ] Allow slug customization: text input with validation
- [ ] Slug validation rules (client-side):
  - lowercase only
  - alphanumeric + hyphens (no spaces, special chars)
  - max 100 chars
  - show error if invalid format
- [ ] Show real-time preview: `/f/{slug}` URL
- [ ] Add copy-to-clipboard button for URL
- [ ] "Publish" button: disabled until slug is valid
- [ ] "Cancel" button: close modal, stay in draft
- [ ] Test: Type slug; see preview; copy URL works

**Maps to:** R-007 (publish), AC-4 (slug validation), BR-4 (slug format)

---

## Task 5.2: Publish Action - API Call & State Update {#task-52}

`apps/frontend/src/store/followups-store.ts` (extend), `apps/frontend/src/lib/publish-service.ts`

- [ ] On "Publish" click in modal: call `POST /api/follow-ups/:id/publish` with slug
- [ ] Backend validates slug uniqueness; frontend shows error if conflict
- [ ] On success: update followup state:
  - `status = "Published"`
  - `publishedSlug = slug`
  - `publishedAt = now`
- [ ] Show success toast: "Published! Share this URL: [copy button]"
- [ ] Close modal and redirect to published followup detail page
- [ ] Test: Publish followup; verify API call; check state update

**Maps to:** AC-4 (publish action), R-007

---

## Task 5.3: Unpublish Action {#task-53}

`apps/frontend/src/components/followup/followup-detail.tsx`, `apps/frontend/src/store/followups-store.ts`

- [ ] Add "Unpublish" button in published followup detail (visible only if published)
- [ ] Confirmation modal: "Are you sure? URL will become inactive."
- [ ] On confirm: call `POST /api/follow-ups/:id/unpublish`
- [ ] On success: update followup state:
  - `status = "Draft"`
  - `publishedSlug = null`
  - `publishedAt = null`
- [ ] Show success toast: "Unpublished. You can edit the follow-up now."
- [ ] Show edit button (disabled for published, now enabled)
- [ ] Test: Unpublish; verify state changes; edit button enabled

**Maps to:** R-015 (unpublish), BR-5 (immutability)

---

## Task 5.4: Published Follow-up Detail View {#task-54}

`apps/frontend/src/pages/followup-detail.tsx`

- [ ] Display published followup information:
  - Title, company logo, meeting date
  - Status badge (Draft/Published)
  - Public URL with copy button (if published)
- [ ] Show tabs: Overview, Recap, Next Steps, Files, Analytics
- [ ] Overview tab: summary of all content
- [ ] For draft: show "Edit" button → return to editor
- [ ] For published: disable editing; show "Unpublish" button
- [ ] Analytics tab: see Phase 7
- [ ] Navigation: back to followups list
- [ ] Test: Load published followup; buttons work; tabs display

**Maps to:** AC-4, workflow step 14, BR-5 (immutability)

---

## Task 5.5: Follow-ups List with Status Indicators {#task-55}

`apps/frontend/src/components/followup/followups-list.tsx`

- [ ] Display followups as table or card grid:
  - Title, company name, date created, status (Draft/Published)
  - For published: show view count badge
  - For draft: show "Edit" button
  - For published: show "Copy URL" and "Unpublish" buttons
- [ ] Status filter: All, Drafts, Published
- [ ] Company filter: multi-select
- [ ] Date range filter: Last 7d, Last 30d, Last 90d, Custom
- [ ] Sort options: by date (desc/asc), by title, by views
- [ ] Search by title (client-side or debounced API)
- [ ] Pagination: 20 per page
- [ ] Test: Filter, sort, search work; buttons visible per status

**Maps to:** R-012 (follow-up list with filters)

---

## Task 5.6: Draft vs Published Mode - Immutability {#task-56}

`apps/frontend/src/components/followup/editor-lock.tsx`, `apps/frontend/src/hooks/use-followup-edit-mode.ts`

- [ ] For published followups: show "Read-only" banner in editor
- [ ] Disable all form inputs when published (readOnly attr)
- [ ] Disable Tiptap editor when published (readOnly mode in Tiptap)
- [ ] Hide save/auto-save buttons
- [ ] Show "Unpublish to edit" message with link
- [ ] For draft: all inputs enabled; save buttons visible
- [ ] Test: Create draft → edit works; publish → edit disabled; unpublish → edit enabled

**Maps to:** BR-5 (immutability), AC-4

---

## Task 5.7: Error Handling - Slug Conflicts {#task-57}

`apps/frontend/src/lib/slug-validation.ts`, `apps/frontend/src/hooks/use-slug-validation.ts`

think hard

- [ ] Implement client-side slug format validation (real-time)
- [ ] On blur or change: debounce 500ms → check slug uniqueness via API
- [ ] Call `GET /api/follow-ups/check-slug?slug={slug}` to verify uniqueness
- [ ] Show error message if slug taken: "This URL is already taken. Try another."
- [ ] Show success check if slug available
- [ ] Disable publish button if slug invalid
- [ ] Test: Type existing slug → error; type new slug → success; publish works

**Maps to:** BR-4 (slug uniqueness), error handling

---

## Task 5.8: Component Tests - Publish Workflow {#task-58}

`apps/frontend/src/components/__tests__/publish/`

- [ ] Test PublishModal: slug input, validation, copy button
- [ ] Test unpublish: confirmation modal, API call, state update
- [ ] Test FollowupDetail: shows published vs draft state correctly
- [ ] Test FollowupsList: filters, sorts, status badges
- [ ] Test immutability: published → inputs disabled; unpublish → enabled
- [ ] Test slug uniqueness check: API called, error shown
- [ ] Mock store and API
- [ ] Target >80% coverage

**Maps to:** Quality standards (>80% coverage)

---

## Acceptance Criteria Checkpoints

- [x] AC-4: User publishes follow-up → Slug validated, status Published, URL generated *(Tasks 5.1-5.2)*
- [x] R-007: Publish workflow with slug customization *(Tasks 5.1-5.4)*
- [x] R-012: Follow-up list with filters *(Task 5.5)*
- [x] R-015: Unpublish capability *(Task 5.3)*
- [x] BR-4: Slug validation (uniqueness, format) *(Tasks 5.1, 5.7)*
- [x] BR-5: Published follow-ups immutable *(Task 5.6)*

