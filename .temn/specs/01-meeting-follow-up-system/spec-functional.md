# Functional Specification: Meeting Follow-Up System

**Version:** 1.0
**Status:** Draft
**Created:** 2026-01-27
**Epic:** Dynamic Post-Meeting Engagement Platform
**PRD Reference:** [meeting-follow-up-system-prd.md](../../prds/meeting-follow-up-system-prd.md)

---

## Overview

The Meeting Follow-Up System enables sales teams, executives, and partnership professionals to create personalized, trackable web pages after business meetings. Each follow-up page replaces traditional email follow-ups with an engaging, shareable microsite containing meeting recaps, company information, next steps, and resources.

**Core Value:** Replace 15% email engagement with 40%+ web engagement, accelerate deal velocity by 40% (12 days → 7 days), and provide measurable insights into prospect interest.

**Scope:** This spec covers MVP features (Phase 1) including follow-up creation, viewing, draft management, analytics, and template library.

---

## User Stories

### Creator Experience (Sales/Leadership/Solutions)

**US-1: Quick Follow-Up Creation**
- **As a** sales executive
- **I want to** create a follow-up page in under 10 minutes
- **So that** I can send it while the meeting is still fresh in my mind
- **Acceptance:** Time from start to publish is <10 minutes for 80% of users

**US-2: Professional Templates**
- **As a** leader conducting high-stakes meetings
- **I want to** use professional templates for different meeting types
- **So that** my follow-ups reflect our company's quality and save time
- **Acceptance:** 3+ templates available (Sales, Partnership, Technical Demo)

**US-3: Draft Management**
- **As a** sales executive
- **I want to** save draft follow-ups and return later
- **So that** I don't lose progress if interrupted or need input from colleagues
- **Acceptance:** Auto-save every 30 seconds, drafts list shows last edited time

**US-4: Edit After Publishing**
- **As a** solutions engineer
- **I want to** edit published follow-ups to fix typos or add resources
- **So that** I can update information without breaking the prospect's link
- **Acceptance:** Edit button visible on published pages, changes appear immediately

**US-5: Engagement Visibility**
- **As a** sales executive
- **I want to** see when prospects view my follow-up and which sections they engage with
- **So that** I know when to follow up and what they're interested in
- **Acceptance:** Analytics show views, time on page, section engagement within 5 minutes of activity

### Prospect Experience (Recipients)

**US-6: Quick Access to Meeting Info**
- **As a** prospect
- **I want to** quickly find what was discussed and agreed upon
- **So that** I can recall the meeting and share info with my team
- **Acceptance:** Page loads in <2s, meeting recap is first section, clear structure

**US-7: Easy Sharing**
- **As a** prospect
- **I want to** share the follow-up page with colleagues
- **So that** stakeholders who weren't in the meeting can get context
- **Acceptance:** URL works without login, mobile-optimized, printable

**US-8: Clear Next Steps**
- **As a** prospect
- **I want to** understand what actions I need to take and when
- **So that** I can move forward efficiently
- **Acceptance:** Next steps section prominently displayed, each action has owner and deadline

---

## Requirements by Priority

### P0 - Must Have (MVP Launch Blockers)

#### Follow-Up Creation

**REQ-001: Follow-Up Page Creator**
- User can create new follow-up via "Create Follow-Up" action
- Form includes: Meeting title, date, prospect company, prospect contacts, meeting type selection
- Text editor for meeting recap (rich text: bold, italic, bullets, headings)
- Next steps section: Add/remove action items, assign owner (us/them), set deadline
- Resource attachments: Upload files (PDF, PPTX, DOCX) max 10MB each, add external links
- Auto-generate friendly URL: `/followup/[company]-[date]` format (e.g., `/followup/acme-corp-jan-27-2026`)
- User can edit auto-generated URL before publishing (validate uniqueness)
- Preview mode: Show what prospect will see before publishing
- Publish button: Make page live and show shareable link

**REQ-002: Auto-Save & Draft Management**
- Auto-save draft every 30 seconds while editing
- "Save Draft" button for manual save
- Drafts list page showing: Title, prospect company, last edited timestamp, "Continue Editing" action
- Sort drafts by: Most recent, oldest, company name
- Delete draft action (with confirmation)
- Badge count showing number of drafts on main navigation

**REQ-003: Template Library**
- 3 pre-built templates: "Sales Meeting", "Partnership Discussion", "Technical Demo"
- Templates include: Pre-populated section headings, sample content (user edits), suggested structure
- Template selection on create: Show preview, "Use This Template" button
- "Start Blank" option for freeform creation

#### Company Information

**REQ-004: Shared Company Content Library**
- Admin can manage company content: About Us, Value Proposition, Case Studies, Team Bios
- Content stored centrally, reusable across all follow-ups
- Creator can insert library items into follow-up (drag or click to add)
- Editing library item updates all follow-ups automatically (living content)
- Creator can override per page (creates local copy that won't auto-update)

#### Published Follow-Up Viewing

**REQ-005: Prospect View Experience**
- Public URL (no login required): `/followup/[unique-slug]`
- Page structure: Header (meeting title, date, companies/logos), Meeting Recap, Company Information, Next Steps, Resources, Footer (contact info)
- Mobile-responsive design (works on phone, tablet, desktop)
- Page load time: <2 seconds
- Print-friendly CSS (clean layout for PDF export)

**REQ-006: Post-Publish Editing**
- Creator can click "Edit" on published page
- Changes save immediately, visible to prospects on page refresh
- No versioning in MVP (future enhancement)
- No notification to prospect when edited (future enhancement)

#### Analytics & Tracking

**REQ-007: Basic Analytics Dashboard**
- Per follow-up metrics: Total views, unique visitors, first viewed timestamp, last viewed timestamp, average time on page
- Section engagement: % of visitors who viewed each section, scroll depth
- Resource tracking: Downloads per file, clicks per external link
- Visitor information: Device type (mobile/tablet/desktop), browser, approximate location (city/country from IP)
- Analytics visible to creator only (not prospect)
- Real-time updates (refresh every 1 minute when dashboard open)

**REQ-008: Follow-Up List & Management**
- "My Follow-Ups" page showing all published pages
- Display: Prospect company, meeting date, page URL, view count, last viewed, status (Draft/Published)
- Sort by: Most recent, most viewed, company name, date
- Filter by: Date range, meeting type
- Actions per follow-up: View, Edit, Copy Link, View Analytics, Archive

### P1 - Should Have (Post-MVP, Priority for Phase 2)

**REQ-009: Key Participants Section**
- Add attendees from both sides: Name, role, company, photo (optional)
- Display on follow-up page as visual roster
- Quick reference for prospect to know who to contact

**REQ-010: Password Protection (Optional per Page)**
- Creator can enable password protection on publish
- Simple password field (not user account based)
- Password displayed to creator (they share via separate channel)
- Prospect enters password to view page

**REQ-011: Advanced Analytics**
- Heatmaps showing where visitors click
- Scroll depth per section (% who reach bottom)
- Time spent per section
- Return visitor tracking (same IP/device)

**REQ-012: Email Integration**
- Generate shareable email template with link
- "Copy Email" button creates draft with intro text + link
- Track if email was sent (optional integration)

### P2 - Could Have (Future Enhancements)

**REQ-013: Custom Branding per Page**
- Override colors, logo, fonts per follow-up
- White-label option for partnership pages

**REQ-014: Expiration Dates**
- Set expiration date on publish (page becomes unavailable after)
- Show countdown to prospect ("This page expires in 7 days")

**REQ-015: Archive Feature**
- Move published page to archive (removes from active list)
- Page URL still works, but hidden from creator's main view

**REQ-016: Copy from Previous Meeting**
- "Copy from Previous" option when creating new follow-up
- Pre-fills company info and common resources from last meeting with same prospect

---

## Business Rules

### BR-001: URL Uniqueness
- Each follow-up must have unique URL slug
- System validates on publish and shows error if conflict
- Auto-generated slugs append `-2`, `-3` if conflict (e.g., `acme-corp-jan-27-2026-2`)

### BR-002: Draft Ownership
- Drafts are owned by creator (user who started the follow-up)
- No sharing/collaboration in MVP
- Only owner can view, edit, or delete their drafts

### BR-003: Published Page Visibility
- Published pages are public (anyone with URL can view)
- No authentication required for prospect viewing
- No robots.txt exclusion (pages are indexable by search engines) - configurable in settings

### BR-004: File Upload Limits
- Maximum file size: 10MB per file
- Maximum files per follow-up: 10
- Supported formats: PDF, PPTX, DOCX, XLSX, PNG, JPG
- Total storage per user: 1GB (configurable)

### BR-005: Auto-Save Behavior
- Auto-save triggers every 30 seconds if content changed
- No save if no changes detected (reduces server load)
- Visual indicator shows "Saving..." and "Saved" status
- On network error, retry up to 3 times, then show error prompt

### BR-006: Analytics Privacy
- No personally identifiable information (PII) stored
- IP addresses hashed after location lookup
- Analytics data retained for 12 months (configurable)
- Creator sees aggregate data only (not individual visitor identities)

### BR-007: Content Library Updates
- Changes to library items apply to all follow-ups using that item
- Exception: If creator manually edited inserted content (creates local copy)
- Local copies don't receive library updates

### BR-008: Meeting Date Validation
- Meeting date must be in the past or today (not future)
- System warns if meeting date is >30 days ago (likely error)

---

## User Workflows

### Workflow 1: Create & Publish Follow-Up (Happy Path)

**Context:** Sales exec just finished meeting with prospect "Acme Corp"

1. User clicks "Create Follow-Up" button
2. System shows template selection: Sales Meeting, Partnership, Demo, or Start Blank
3. User selects "Sales Meeting" template
4. Form loads with pre-populated structure:
   - Meeting Title: "[Prospect] - Sales Meeting"
   - Meeting Date: [Today's date]
   - Prospect Company: [Empty field]
   - Prospect Contacts: [Empty repeatable field]
   - Meeting Type: "Sales Meeting" (pre-selected)
5. User fills in:
   - Prospect Company: "Acme Corp"
   - Prospect Contacts: "Jane Doe - VP Sales"
   - Meeting recap (edits template text): "We discussed Acme's Q2 expansion plans..."
6. User adds next steps:
   - "Send pricing proposal" - Owner: Us - Deadline: Feb 2
   - "Review with CFO" - Owner: Acme - Deadline: Feb 7
7. User inserts company content from library: "Our Value Proposition", "Case Study: TechCo"
8. User uploads resource: "Product Roadmap Q1 2026.pdf"
9. System auto-generates URL: `/followup/acme-corp-jan-27-2026`
10. User clicks "Preview" - sees prospect view in new tab
11. User clicks "Publish"
12. System saves, makes page live, shows success modal:
    - "Follow-up published!"
    - URL: `https://yourcompany.com/followup/acme-corp-jan-27-2026`
    - Copy Link button
    - View Page button
    - Create Another button
13. User clicks "Copy Link" and pastes into email to Jane

**Time:** ~8 minutes

### Workflow 2: Save Draft & Return Later

**Context:** User starts creating follow-up but is interrupted

1. User starts creating follow-up (steps 1-5 from Workflow 1)
2. User receives phone call, navigates away from page
3. System auto-saves draft at 30-second mark
4. User returns 2 hours later
5. User clicks "Drafts" in navigation (sees badge: "1")
6. Drafts page shows: "Acme Corp - Sales Meeting" | Last edited: 2 hours ago
7. User clicks "Continue Editing"
8. Form loads with all saved content
9. User completes follow-up and publishes

### Workflow 3: Prospect Views Follow-Up

**Context:** Prospect "Jane Doe" receives email with link

1. Jane clicks link in email: `https://yourcompany.com/followup/acme-corp-jan-27-2026`
2. Browser opens page (no login required)
3. Page loads in <2 seconds:
   - Header: "Acme Corp - Sales Meeting" | Jan 27, 2026
   - Meeting Recap section (first, most important)
   - Company Information section
   - Next Steps section (highlights "Review with CFO - Due Feb 7")
   - Resources section (shows "Product Roadmap Q1 2026.pdf" download)
4. Jane scrolls to Next Steps, sees her action item highlighted
5. Jane clicks "Product Roadmap Q1 2026.pdf" to download
6. Jane copies URL and shares with CFO via Slack
7. CFO opens same URL on mobile device, sees mobile-optimized view

**Analytics Captured:**
- 2 unique visitors (Jane, CFO)
- Devices: Desktop, Mobile
- Sections viewed: All (100% scroll depth)
- Resource downloads: 1 (PDF)
- Time on page: Jane (3m 45s), CFO (2m 10s)

### Workflow 4: Edit Published Follow-Up

**Context:** Sales exec realizes they forgot to add a case study

1. User opens "My Follow-Ups" page
2. Finds "Acme Corp - Sales Meeting" follow-up
3. Clicks "Edit"
4. Form loads with published content (editable)
5. User scrolls to Company Information section
6. User inserts "Case Study: RetailCo" from library
7. User clicks "Save Changes"
8. System updates page immediately
9. Jane (prospect) refreshes page, sees new case study

### Workflow 5: View Analytics

**Context:** Sales exec wants to know if prospect engaged with follow-up

1. User opens "My Follow-Ups" page
2. Clicks "View Analytics" on "Acme Corp" follow-up
3. Analytics dashboard shows:
   - **Overview:** 2 views | 2 unique visitors | Last viewed: 1 hour ago
   - **Engagement:** Avg time on page: 2m 58s
   - **Sections:** Meeting Recap (100%), Next Steps (100%), Resources (50%)
   - **Resources:** Product Roadmap.pdf - 1 download
   - **Visitors:** Desktop (1), Mobile (1) | Locations: San Francisco, CA
4. User sees high engagement, knows to follow up soon

---

## Acceptance Criteria

### AC-001: Follow-Up Creation Time
- **Given** a user with meeting notes ready
- **When** they create a follow-up from template
- **Then** 80% complete in <10 minutes from start to publish

### AC-002: Auto-Save Reliability
- **Given** user is editing a draft
- **When** 30 seconds elapse with changes
- **Then** system auto-saves and shows "Saved" indicator
- **And** draft appears in Drafts list with correct timestamp

### AC-003: URL Uniqueness Validation
- **Given** user publishes follow-up with URL `/followup/acme-corp-jan-27-2026`
- **When** another user tries to publish with same URL
- **Then** system shows error "URL already exists" and suggests `/followup/acme-corp-jan-27-2026-2`

### AC-004: Public Page Access
- **Given** a published follow-up with URL
- **When** prospect (unauthenticated user) visits URL
- **Then** page loads without login prompt
- **And** all sections render correctly on mobile and desktop

### AC-005: Analytics Real-Time Update
- **Given** creator is viewing analytics dashboard
- **When** prospect views follow-up page
- **Then** analytics update within 1 minute showing new view
- **And** unique visitor count increments by 1

### AC-006: Resource Download Tracking
- **Given** follow-up has attached PDF
- **When** prospect clicks download link
- **Then** file downloads successfully
- **And** analytics show 1 download for that resource

### AC-007: Mobile Responsiveness
- **Given** prospect views follow-up on mobile device (375px width)
- **When** page loads
- **Then** content is readable without horizontal scroll
- **And** sections stack vertically
- **And** buttons are tappable (min 44px touch target)

### AC-008: Edit After Publish
- **Given** published follow-up
- **When** creator edits and saves changes
- **Then** changes appear immediately on public page
- **And** prospect sees updated content on page refresh

---

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Follow-Up Creation Time** | <10 min (80th percentile) | Time from "Create" click to "Publish" |
| **Draft Completion Rate** | 80%+ | (Published follow-ups) / (Total drafts created) |
| **Prospect Engagement Rate** | 40%+ | (Unique visitors) / (Follow-ups sent) |
| **Time to Next Action** | 7 days avg | Track date from meeting to next logged activity |
| **Multi-Stakeholder Share** | 25%+ | Follow-ups with 2+ unique visitors |
| **Mobile Usage** | 40%+ | % of views on mobile devices |
| **Section Engagement** | Next Steps: 90%+ viewed | % of visitors scrolling to Next Steps |

---

## Out of Scope (Not in This Spec)

- ❌ CRM integration (Salesforce, HubSpot sync)
- ❌ AI-generated content from meeting transcripts
- ❌ Video embedding (YouTube, Loom)
- ❌ Live chat widget on follow-up pages
- ❌ Team collaboration (multiple editors per follow-up)
- ❌ Version history (track changes over time)
- ❌ Email automation (scheduled sends, reminders)
- ❌ Calendar integration (embedded scheduling)
- ❌ Custom domains per follow-up
- ❌ A/B testing different follow-up versions

---

## Open Questions

| Question | Status | Decision |
|----------|--------|----------|
| Should we allow anonymous analytics opt-out for privacy? | Open | TBD |
| What happens to analytics if follow-up is deleted? | Open | TBD |
| Should creators receive notification when prospect views page? | Deferred to P1 | Not MVP |
| Can multiple users edit same company content library? | Open | TBD - likely admin-only MVP |

---

## Dependencies

### Technical Dependencies
- Web hosting with custom URL routing
- File storage for resource attachments (S3 or equivalent)
- Analytics tracking library (custom or 3rd party)
- Rich text editor component
- Mobile-responsive framework

### Business Dependencies
- Marketing team to create initial company content library (3-5 pieces)
- Sales leadership approval for template content
- Legal review of analytics tracking compliance (GDPR)

### Design Dependencies
- Follow-up page design (mobile + desktop)
- Creator dashboard/form design
- Analytics dashboard design

---

## Appendix: Template Structure

### Template 1: Sales Meeting

**Pre-populated sections:**
- Meeting Recap: "Thank you for taking the time to meet with us today. We appreciated learning about [Prospect Company]'s goals and challenges. Here's a summary of what we discussed..."
- Our Value Proposition: [From company library]
- Next Steps: [Empty - user fills]
- Recommended Resources: Product overview, pricing guide

### Template 2: Partnership Discussion

**Pre-populated sections:**
- Meeting Recap: "We're excited about the potential partnership between [Our Company] and [Prospect Company]. Here's what we covered in our discussion..."
- Partnership Opportunities: [Empty - user describes]
- Our Capabilities: [From company library]
- Next Steps: [Empty - user fills]

### Template 3: Technical Demo

**Pre-populated sections:**
- Demo Summary: "Thanks for joining our technical demonstration. We walked through [feature areas] and addressed your team's specific questions about..."
- Technical Resources: Architecture diagrams, API documentation, integration guides
- Implementation Timeline: [Empty - user fills]
- Next Steps: [Empty - user fills]

---

**Document Version**
- v1.0 (2026-01-27): Initial functional specification
