# Phase 9: File Uploads & Management

Spec: [R-009](../frontend-app-spec-functional.md#r-009), [Workflow 1 Step 10](../frontend-app-spec-functional.md#workflow-1-create-first-follow-up)

Deps: Phase 4 (editor), Phase 2 (API client)

## Task 9.1: File Upload UI with react-dropzone {#task-91}

`apps/frontend/src/components/followup/file-upload.tsx`

think hard

- [ ] Install react-dropzone 14.2.3
- [ ] Create drag-and-drop zone for files
- [ ] Display files: accepted formats (PDF, PPT, DOCX, XLSX, PNG, JPG)
- [ ] Max file size: 10MB per file
- [ ] Show error if file too large or invalid format
- [ ] Allow multiple file selection
- [ ] Display selected files list:
  - File name, size, type icon
  - Progress bar (during upload)
  - Cancel button per file
- [ ] Upload on file selection (not just on button click)
- [ ] Test: Drag file; verify upload starts; progress shows

**Maps to:** R-009 (file uploads), workflow step 10

---

## Task 9.2: File Upload to Supabase Storage {#task-92}

`apps/frontend/src/lib/file-upload-service.ts`

ultrathink

- [ ] Setup Supabase client: initialize with project URL and API key
- [ ] On file select: upload to Supabase storage bucket
- [ ] File path: `followups/{followupId}/{userId}/{filename}`
- [ ] Show upload progress: track bytes uploaded
- [ ] Handle upload errors: retry up to 3 times with exponential backoff
- [ ] On success: get public URL from Supabase
- [ ] Create file record: `POST /api/files` with:
  - `followupId`
  - `fileName` (original name)
  - `fileSize`
  - `fileType` (MIME type)
  - `storagePath` (Supabase path)
  - `publicUrl` (Supabase public URL)
- [ ] Add file to followup state
- [ ] Test: Upload file; verify in Supabase; record in DB

**Maps to:** R-009 (file upload)

---

## Task 9.3: File Preview Component {#task-93}

`apps/frontend/src/components/followup/file-preview.tsx`, `apps/frontend/src/components/common/file-icon.tsx`

- [ ] Display uploaded files in editor as list:
  - File type icon (PDF icon for PDF, etc.)
  - File name with link to download
  - File size (formatted: KB, MB)
  - Delete button (with confirm)
- [ ] On delete: remove file from followup, delete from Supabase
- [ ] Show thumbnail for images (preview on hover)
- [ ] Test: Upload file; preview shows; delete works

**Maps to:** R-009 (file display)

---

## Task 9.4: File Download Tracking {#task-94}

`apps/frontend/src/lib/file-tracker.ts`, `apps/frontend/src/components/public/files-display.tsx`

- [ ] In public viewer: on file download click
  - Track event: `POST /api/analytics/events` with `eventType: "download"`
  - Include followupId, fileId, sessionId
- [ ] Update analytics: file download count
- [ ] Test: Download file in public viewer; verify event logged

**Maps to:** success metric (>40% download rate), AC-5

---

## Task 9.5: File Size & Format Validation {#task-95}

`apps/frontend/src/lib/file-validation.ts`, `apps/frontend/src/components/followup/`

- [ ] Client-side validation:
  - Max 10MB per file
  - Allowed formats: PDF, PPT, DOCX, XLSX, PNG, JPG, GIF
  - Check MIME type (not just extension)
- [ ] Show error toast if validation fails
- [ ] Prevent upload if validation fails
- [ ] Test: Upload oversized file; wrong format; verify blocked

**Maps to:** R-009 (format/size limits), security standards

---

## Task 9.6: File Upload Progress & Error Handling {#task-96}

`apps/frontend/src/components/followup/file-upload-progress.tsx`

- [ ] Show progress bar per file during upload
- [ ] Display percentage (0-100%)
- [ ] Show upload speed (MB/s)
- [ ] Show ETA (estimated time remaining)
- [ ] Cancel button: abort upload
- [ ] On error: show error message + retry button
- [ ] Retry: restart upload from scratch
- [ ] Test: Manually pause network; verify progress stops; resume; retry works

**Maps to:** UX polish, quality standards (error handling)

---

## Task 9.7: File List in Follow-up Detail {#task-97}

`apps/frontend/src/components/followup/followup-detail.tsx` (extend)

- [ ] Add "Files" tab in followup detail page
- [ ] Display uploaded files:
  - For draft: show delete button
  - For published: show read-only list with download link
- [ ] Call `GET /api/follow-ups/:id/files` to fetch files
- [ ] Test: Load followup; see files; download works

**Maps to:** R-009 (file management)

---

## Task 9.8: Component Tests - File Upload {#task-98}

`apps/frontend/src/components/__tests__/files/`

- [ ] Test FileUpload: drag file; show progress; upload completes
- [ ] Test FilePreview: render list; delete file; confirm
- [ ] Test FileValidation: reject oversized; reject wrong format; accept valid
- [ ] Test FileTracking: download event tracked
- [ ] Mock Supabase and API
- [ ] Target >80% coverage

**Maps to:** Quality standards (>80% coverage)

---

## Acceptance Criteria Checkpoints

- [x] R-009: File uploads (PDFs, presentations, 10MB limit) *(Tasks 9.1-9.5)*
- [x] File preview and management *(Tasks 9.3, 9.7)*
- [x] Download tracking in analytics *(Task 9.4)*
- [x] Progress and error handling *(Task 9.6)*

