# Phase 4: Follow-up Creation & Editor

Spec: [R-004](../frontend-app-spec-functional.md#r-004), [R-005](../frontend-app-spec-functional.md#r-005), [R-006](../frontend-app-spec-functional.md#r-006), [R-010](../frontend-app-spec-functional.md#r-010), [AC-3](../frontend-app-spec-functional.md#ac-3), [AC-8](../frontend-app-spec-functional.md#ac-8), [Workflow 1](../frontend-app-spec-functional.md#workflow-1-create-first-follow-up)

Deps: Phase 2 & 3 complete (stores, companies)

## Task 4.1: Follow-up Creation Flow - Wizard Step 1 (Company & Template) {#task-41}

`apps/frontend/src/pages/followup-create-wizard.tsx`, `apps/frontend/src/components/followup/`

think hard

- [ ] Create multi-step wizard layout with progress indicator
- [ ] Step 1: Company Selection
  - Show company list or allow inline company creation
  - If no companies exist, show "Create your first company" CTA
  - Selected company shows logo + name
- [ ] Step 2: Template Selection (see Task 4.2)
- [ ] Step 3: Meeting Details (see Task 4.3)
- [ ] Implement "Next" button (validate current step)
- [ ] Implement "Back" button (preserve form data)
- [ ] Store wizard state in Zustand store: `wizardStore`
- [ ] Test: Navigate through steps; company selection works

**Maps to:** AC-3, workflow step 1-5

---

## Task 4.2: Template Selection Modal {#task-42}

`apps/frontend/src/components/followup/template-selector.tsx`

- [ ] Fetch templates from `GET /api/templates`
- [ ] Display templates as cards: name, description, preview thumbnail
- [ ] Filter templates by category (if available)
- [ ] Add search by template name
- [ ] Click template to select (highlight, show "Selected" badge)
- [ ] Show preview panel on right: display template content
- [ ] "Confirm" button to proceed to step 3
- [ ] Test: Select template; preview updates; confirm works

**Maps to:** AC-8 (template selection), R-004

---

## Task 4.3: Meeting Details Form - Step 2 {#task-43}

`apps/frontend/src/components/followup/meeting-details-form.tsx`

- [ ] Setup React Hook Form + Zod validation:
  - `title` (required, max 200 chars)
  - `meetingDate` (required, datetime picker)
  - `meetingType` (required, select: "Discovery", "Demo", "Negotiation", etc.)
  - `attendees` (optional, multi-select from company contacts)
- [ ] Implement datetime picker (use Headless UI or custom)
- [ ] Multi-select for attendees: display selected with remove button
- [ ] Form shows error messages inline
- [ ] "Next" button validates and proceeds to editor
- [ ] Test: Fill form; select attendees; submit

**Maps to:** AC-3, workflow step 6-7

---

## Task 4.4: Tiptap Rich Text Editor Integration {#task-44}

`apps/frontend/src/components/followup/editor/tiptap-editor.tsx`, `apps/frontend/src/components/followup/editor/`

ultrathink

- [ ] Install Tiptap 2.1.16 with starter kit extensions
- [ ] Create editor component with toolbar:
  - Text formatting: bold, italic, underline, strikethrough
  - Lists: bullet, numbered
  - Headings: h1, h2, h3
  - Links: add/edit/remove
  - Alignment: left, center, right
  - Undo/redo buttons
- [ ] Setup content serialization: JSON/HTML conversion
- [ ] Add character count display (max 10,000 chars)
- [ ] Implement read-only mode (for viewing in public viewer)
- [ ] Add placeholder text: "Start typing your meeting recap..."
- [ ] Performance: debounce onChange events (500ms)
- [ ] Test: Type content; format text; verify output

**Maps to:** R-005 (rich text), AC-3

---

## Task 4.5: Follow-up Editor Page - Main Content {#task-45}

`apps/frontend/src/pages/followup-editor.tsx`, `apps/frontend/src/components/followup/editor-layout.tsx`

- [ ] Create layout: title field, tabs (Recap, Next Steps, Files, Library)
- [ ] Tab 1 - Recap: Tiptap editor for meeting recap content (Task 4.4)
- [ ] Tab 2 - Next Steps: see Task 4.6
- [ ] Tab 3 - Files: see Task 9 (file uploads)
- [ ] Tab 4 - Library: see Task 8 (library content)
- [ ] Add auto-save indicator: "Saving...", "Saved at 2:34 PM"
- [ ] Fetch existing followup data if in edit mode
- [ ] Show draft status badge in header
- [ ] Test: Switch between tabs; content preserved; auto-save works

**Maps to:** AC-3, workflow step 8-10

---

## Task 4.6: Next Steps Management Component {#task-46}

`apps/frontend/src/components/followup/next-steps-form.tsx`

think hard

- [ ] Create repeating form for next steps:
  - `action` (required, text input, max 200 chars)
  - `owner` (required, select from attendees or free text)
  - `deadline` (required, date picker)
  - `completed` (optional, checkbox)
- [ ] Add button to add new step
- [ ] Add remove button per step (with confirm)
- [ ] Validation: at least 1 step required before publish
- [ ] Store next steps in followup state
- [ ] Test: Add/remove steps; validation works

**Maps to:** R-006 (next steps), AC-3

---

## Task 4.7: Auto-Save Implementation with Debounce {#task-47}

`apps/frontend/src/store/auto-save-store.ts`, `apps/frontend/src/hooks/use-auto-save.ts`

think hard

- [ ] Create `useAutoSave()` hook: tracks unsaved changes
- [ ] Debounce timer: 30 seconds (configurable)
- [ ] On debounce trigger: call `PUT /api/follow-ups/:id` with current form state
- [ ] Show auto-save status in editor:
  - Unsaved: red indicator
  - Saving: yellow indicator + spinner
  - Saved: green checkmark + timestamp
- [ ] Handle auto-save errors: retry up to 3 times, then notify user
- [ ] Prevent navigation if unsaved (show confirmation modal)
- [ ] Warn on browser unload if unsaved (beforeunload event)
- [ ] Test: Edit field → wait 30s → verify API call; manual save disables debounce

**Maps to:** R-010 (auto-save), performance standards

---

## Task 4.8: Template Pre-population {#task-48}

`apps/frontend/src/lib/template-engine.ts`

- [ ] On template selection, fetch full template content (if not already loaded)
- [ ] Parse template structure: recap sections, placeholder text
- [ ] Pre-populate Tiptap editor with template structure
- [ ] Mark template sections as editable placeholders (visual indicator)
- [ ] User can replace each section independently
- [ ] All sections remain fully editable (not locked)
- [ ] Test: Select template → editor populates → edit sections

**Maps to:** AC-8 (template pre-population)

---

## Task 4.9: Draft Status & Unsaved Indicator {#task-49}

`apps/frontend/src/components/followup/draft-indicator.tsx`

- [ ] Show draft status badge in header (next to title)
- [ ] Add warning banner if navigating away with unsaved changes
- [ ] Disable publish button if required fields missing (title, recap, steps)
- [ ] Show validation errors on publish attempt
- [ ] Test: Make edits; try to leave page; verify warning

**Maps to:** AC-3, BR-5 (draft immutability)

---

## Task 4.10: Component Tests - Editor {#task-410}

`apps/frontend/src/components/__tests__/editor/`

- [ ] Test TiptapEditor: render; input text; format text; verify output
- [ ] Test NextStepsForm: add/remove steps; validation; serialization
- [ ] Test FollowUpEditor: switch tabs; auto-save called; draft status
- [ ] Test TemplateSelector: load templates; select; preview updates
- [ ] Test MeetingDetailsForm: form validation; attendee selection
- [ ] Mock store and API with Vitest
- [ ] Target >80% coverage

**Maps to:** Quality standards (>80% coverage)

---

## Task 4.11: Integration Tests - Create Follow-up Flow {#task-411}

`apps/frontend/src/__tests__/integration/`

- [ ] Test: New user → Select company → Choose template → Fill details → Editor opens → Type recap → Add steps
- [ ] Test: All form fields save to store (no data loss)
- [ ] Test: Auto-save triggers and syncs with backend
- [ ] Test: Switching between tabs preserves data
- [ ] Test: Template content pre-populates correctly
- [ ] Target 5-6 critical user flows

**Maps to:** Quality standards (integration testing)

---

## Task 4.12: Performance Optimization - Tiptap & Editor Rendering {#task-412}

`apps/frontend/src/components/followup/editor/tiptap-editor.tsx`

- [ ] Profile editor performance with React DevTools
- [ ] Implement `useMemo` for editor instance (prevent re-creates)
- [ ] Debounce editor onChange callbacks (500ms)
- [ ] Use `React.memo` for editor toolbar
- [ ] Lazy load Tiptap extensions: load only used extensions
- [ ] Test: Type in large document (>5000 chars); measure render time
- [ ] Target: <100ms render time with 10,000+ chars

**Maps to:** Performance standards (<2s load time)

---

## Acceptance Criteria Checkpoints

- [x] AC-3: User creates follow-up → Template selection, auto-save, draft status *(Tasks 4.1-4.9)*
- [x] AC-8: User selects template → Editor pre-populates, all editable *(Tasks 4.2, 4.8)*
- [x] R-004: Follow-up creation with templates *(Tasks 4.1-4.3)*
- [x] R-005: Rich text editor (Tiptap) *(Task 4.4)*
- [x] R-006: Next steps management *(Task 4.6)*
- [x] R-010: Auto-save with 30s debounce *(Task 4.7)*

