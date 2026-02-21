# Phase 8: Library Content & Insertion

Spec: [R-013](../frontend-app-spec-functional.md#r-013), [AC-7](../frontend-app-spec-functional.md#ac-7)

Deps: Phase 4 (editor), Phase 2 (stores, API)

## Task 8.1: Library Store (Zustand) {#task-81}

`apps/frontend/src/store/library-store.ts`

- [ ] Create Zustand store with state:
  - `libraryItems: LibraryItem[]`
  - `filteredItems: LibraryItem[]`
  - `selectedCategory: string`
  - `searchQuery: string`
  - `loading: boolean`
  - `error: string | null`
- [ ] Implement actions:
  - `fetchLibrary(userId)` - `GET /api/library` (fetch all items)
  - `filterByCategory(category)` - filter items, update state
  - `search(query)` - client-side search by title/description
  - `selectItem(id)` - set selected item for insertion
- [ ] Categories: "Best Practices", "Case Studies", "Testimonials", "Pricing", "FAQ"
- [ ] Test: Dispatch actions; verify filtering and search

**Maps to:** R-013 (library content), data flow

---

## Task 8.2: Library Browser Modal {#task-82}

`apps/frontend/src/components/followup/library-modal.tsx`, `apps/frontend/src/components/library/`

think hard

- [ ] Create modal component (triggered by "Insert Library Content" button in editor)
- [ ] Layout: two columns (left: list, right: preview)
- [ ] Left column:
  - Category filter buttons (or dropdown)
  - Search input (debounced)
  - Item list: shows matching items with title, preview snippet
  - Scroll area (virtualized if >100 items)
- [ ] Right column:
  - Preview of selected item: title, description, full content
  - "Insert" button: inserts content into editor
- [ ] Show loading spinner while fetching library
- [ ] Show "No items found" if search returns empty
- [ ] Test: Filter by category; search; select item; see preview; insert

**Maps to:** AC-7 (library browser), R-013

---

## Task 8.3: Library Item Insertion into Tiptap {#task-83}

`apps/frontend/src/lib/library-insertion.ts`, `apps/frontend/src/components/followup/editor/`

- [ ] On "Insert" button click:
  - Get Tiptap editor current cursor position
  - Insert library item content at cursor (as rich text block)
  - Close modal
- [ ] Handle different content types:
  - Text content: insert as paragraphs
  - Lists: insert as bullet/numbered list
  - HTML: sanitize and insert as parsed HTML
- [ ] Content is fully editable after insertion (not locked)
- [ ] Undo/redo support (built-in with Tiptap)
- [ ] Test: Insert content; verify appears in editor; editable

**Maps to:** AC-7 (insert into editor), user workflow

---

## Task 8.4: Library Item Management Page {#task-84}

`apps/frontend/src/pages/library-management.tsx`, `apps/frontend/src/components/library/admin/`

- [ ] Display all library items in table format:
  - Title, category, created date, usage count
  - Action buttons: Edit, Delete, View
- [ ] Add "Create New" button
- [ ] Search by title
- [ ] Sort: by date, by title, by usage
- [ ] Pagination: 20 per page
- [ ] Show usage count: how many followups reference this item
- [ ] Test: Load list; search; sort; pagination

**Maps to:** R-013 (library management), user admin feature

---

## Task 8.5: Library Item Create/Edit Form {#task-85}

`apps/frontend/src/components/library/item-form.tsx`

- [ ] Setup React Hook Form + Zod validation:
  - `title` (required, max 200 chars)
  - `category` (required, select from list)
  - `description` (required, max 500 chars)
  - `content` (required, rich text)
- [ ] Use Tiptap editor for content (similar to followup editor)
- [ ] Form submission: `POST /api/library` or `PUT /api/library/:id`
- [ ] On success: redirect to library management page
- [ ] Test: Create item; edit existing; verify API call

**Maps to:** R-013 (library CRUD)

---

## Task 8.6: Library Item Delete {#task-86}

`apps/frontend/src/components/library/delete-modal.tsx`

- [ ] Show confirmation modal with warning:
  - "Are you sure? This item is used in X followups."
- [ ] "Delete" button: call `DELETE /api/library/:id`
- [ ] On success: remove from list; show success toast
- [ ] On error: show error message
- [ ] Test: Delete item; verify confirmation; API call

**Maps to:** R-013 (library management)

---

## Task 8.7: Category Tags & Filtering {#task-87}

`apps/frontend/src/components/library/category-filter.tsx`

- [ ] Display category filter as pill buttons or dropdown
- [ ] Active category highlighted
- [ ] Show item count per category
- [ ] On click: update store filter; list updates
- [ ] "All" option shows all items
- [ ] Test: Click categories; list filters correctly

**Maps to:** R-013 (browse by type)

---

## Task 8.8: Search & Autocomplete {#task-88}

`apps/frontend/src/components/library/search-box.tsx`

- [ ] Search input with debounce (500ms)
- [ ] On change: trigger `search(query)` action
- [ ] Show matching items in real-time
- [ ] Case-insensitive search on title and description
- [ ] Show "X results found" message
- [ ] Test: Type query; verify results; debounce works

**Maps to:** R-013 (browse library)

---

## Task 8.9: Component Tests - Library {#task-89}

`apps/frontend/src/components/__tests__/library/`

- [ ] Test LibraryModal: loads items; filters by category; searches; inserts
- [ ] Test LibraryItemForm: form validation; create/edit; submit
- [ ] Test LibraryManagement: loads list; search; sort; pagination
- [ ] Test CategoryFilter: filter buttons work
- [ ] Test SearchBox: debounce works; results update
- [ ] Mock library store and API
- [ ] Target >80% coverage

**Maps to:** Quality standards (>80% coverage)

---

## Acceptance Criteria Checkpoints

- [x] AC-7: User inserts library content → Modal shows content by type, selected content inserted *(Tasks 8.2-8.3)*
- [x] R-013: Library content browsing and insertion *(Tasks 8.1-8.3)*
- [x] Library management UI *(Tasks 8.4-8.8)*

