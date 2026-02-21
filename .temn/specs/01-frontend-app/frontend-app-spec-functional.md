# Functional Specification: Meeting Follow-Up Frontend

**Version:** 1.0 | **Status:** Draft | **Created:** 2026-02-01

---

## Overview

Enable sales reps, account managers, and partnership teams to create trackable follow-up pages after business meetings. Replace email follow-ups with engaging web experiences featuring analytics.

| Property | Value |
|----------|-------|
| **Target Users** | Sales reps, account managers, partnership teams at large companies |
| **Core Problem** | Email follow-ups get lost; no visibility into prospect engagement |
| **Value Proposition** | Create professional follow-ups in <5 min with engagement analytics |
| **Backend Status** | Complete (45+ endpoints across 8 resources) |

---

## User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-1 | Sales rep | Create a follow-up from a template in <5 min | I send it while the meeting is fresh |
| US-2 | Sales rep | See when prospects view my follow-up | I know the right time to reach out |
| US-3 | Prospect | Access follow-up without logging in | I can share with my team easily |
| US-4 | Account manager | Track which content prospects engage with | I focus on what matters to them |
| US-5 | Partnership lead | Manage companies and contacts in one place | I organize all my relationships |

---

## Requirements by Priority

### P0 - Must Have (MVP)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R-001 | Clerk authentication (sign-up, sign-in, sign-out) | Users authenticate via Clerk; protected routes redirect to sign-in |
| R-002 | Company CRUD (name, website, industry, logo, description) | Create/view/edit/delete companies; name required; website validated |
| R-003 | Contact management per company | Add/edit/delete contacts with name, email, role, LinkedIn |
| R-004 | Follow-up creation with template selection | Select template, guided questions, auto-populate content |
| R-005 | Rich text editor for meeting recap | Tiptap editor with formatting (bold, italic, bullets, headings) |
| R-006 | Next steps management | Action items with owner, deadline, completed checkbox |
| R-007 | Publish workflow with slug customization | Publish draft, customize/auto-generate slug, get public URL |
| R-008 | Public follow-up viewer (unauthenticated) | Clean design, meeting recap, next steps, files, analytics tracking |

### P1 - Should Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R-009 | File uploads (PDFs, presentations) | Upload up to 10MB; common formats; display in viewer |
| R-010 | Auto-save with 30s debounce | Visual indicator (Saving.../Saved); retry on failure |
| R-011 | Analytics dashboard per follow-up | Views over time, device types, geography, session duration |
| R-012 | Follow-up list with filters | Status, company, date filters; pagination (20/page); search |
| R-013 | Library content browsing | Browse by type; preview; insert into editor |
| R-014 | Time range filters for analytics | 7d, 30d, 90d, all time; charts update accordingly |
| R-015 | Unpublish capability | Revert published to draft; URL becomes inactive |

### P2 - Could Have (Future)

| ID | Requirement | Notes |
|----|-------------|-------|
| R-016 | Content overrides per follow-up | Customize library content without affecting source |
| R-017 | Approval workflows | Submit for review before publish |
| R-018 | Multi-user collaboration | Comments, @mentions |
| R-019 | Email notifications | View alerts, deadline reminders |
| R-020 | Custom branding per follow-up | Colors, fonts, logo per page |
| R-021 | CRM integrations | Salesforce, HubSpot sync |

---

## Business Rules

| ID | Rule | Validation |
|----|------|------------|
| BR-1 | All routes except public viewer require authentication | Redirect unauthenticated users to Clerk sign-in |
| BR-2 | Users can only access their own data | API enforces userId filtering; 403 on unauthorized access |
| BR-3 | Company name required; website must be valid URL | Frontend validation + backend Zod schema |
| BR-4 | Slug must be unique, lowercase, alphanumeric + hyphens | Backend validates uniqueness; auto-generate from title |
| BR-5 | Published follow-ups are immutable | Edit button disabled; must unpublish first |
| BR-6 | Analytics: hash IPs (SHA-256), no PII, 12-month retention | Backend handles; frontend displays aggregated data only |

---

## User Workflows

### Workflow 1: Create First Follow-up

```
1. Sign in via Clerk
2. Dashboard shows "Create your first follow-up" CTA
3. Click "New Follow-up"
4. Select or create company (inline form if none exist)
5. Select template from modal
6. Fill meeting details (title, date, type)
7. Add attendees from company contacts
8. Write meeting recap in rich text editor
9. Add next steps (action, owner, deadline)
10. Optionally attach files (drag-and-drop)
11. Auto-save occurs every 30s
12. Click "Publish"
13. Customize slug in modal
14. System publishes, shows public URL
15. Copy URL to share with prospect
```

**Success:** <5 minutes from start to published URL

### Workflow 2: View Analytics

```
1. View follow-ups list
2. Published items show view count badge
3. Click follow-up to view details
4. Navigate to Analytics tab
5. See: total views, views over time chart, device pie chart, geography
6. Select time range (7d, 30d, 90d, all)
7. Charts update in real-time
```

### Workflow 3: Public Viewer Experience

```
1. Prospect receives link: /f/{slug}
2. Page loads (no authentication)
3. System tracks: page view, device, location
4. Prospect sees: company logo, title, date, meeting recap, next steps, files
5. Prospect scrolls (engagement tracked)
6. Prospect downloads files (download events tracked)
7. Analytics dashboard updates for follow-up owner
```

---

## Acceptance Criteria

| ID | Scenario | Expected Outcome |
|----|----------|------------------|
| AC-1 | New user visits app | Sees Clerk sign-in/sign-up; can use email or OAuth |
| AC-2 | User creates company | Company saved with all fields; appears in list |
| AC-3 | User creates follow-up | Template selection, guided input, auto-save, draft status |
| AC-4 | User publishes follow-up | Slug validated, status changes to Published, URL generated |
| AC-5 | Prospect visits public URL | Content displays without login; analytics tracked |
| AC-6 | User views analytics | Charts show views, devices, geography, session duration |
| AC-7 | User inserts library content | Modal shows content by type; selected content inserted into editor |
| AC-8 | User selects template | Editor pre-populates with template sections; all editable |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to create follow-up | <5 minutes | Start to publish timestamp |
| Publish rate | >70% | Published / Total drafts |
| Analytics adoption | >80% view within 24h | Users viewing analytics post-publish |
| Prospect engagement | >3 min session duration | Average time on public viewer |
| File engagement | >40% download rate | File downloads / Page views |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Content overrides per follow-up | P2 - complex state management |
| Approval workflows | P2 - requires multi-user roles |
| Multi-user collaboration | P2 - comments, @mentions |
| Email notifications | P2 - infrastructure needed |
| Custom branding per follow-up | P2 - design complexity |
| A/B testing | P2 - requires experiment framework |
| CRM integrations | P2 - third-party API work |

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Backend API | Complete | 45+ endpoints across 8 resources |
| Clerk authentication | Ready | Configuration needed in frontend |
| PostgreSQL database | Deployed | Schema matches backend requirements |
| Supabase Storage | Ready | For file uploads |

---

## Screen Inventory (UI Scope)

| Screen | Purpose | Auth Required |
|--------|---------|---------------|
| Sign In / Sign Up | Clerk authentication | No |
| Dashboard | Overview, quick actions, recent follow-ups | Yes |
| Companies List | View, search, filter companies | Yes |
| Company Detail | View/edit company, manage contacts | Yes |
| Follow-ups List | View, search, filter, sort follow-ups | Yes |
| Follow-up Editor | Create/edit follow-up with rich text | Yes |
| Template Selector | Browse and select templates | Yes |
| Library Browser | Browse and insert library content | Yes |
| Analytics Dashboard | View engagement metrics and charts | Yes |
| Public Viewer | View published follow-up | No |

---

**Document Version:** 1.0 (2026-02-01) - Initial frontend specification
