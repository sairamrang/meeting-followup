# MVP Test Plan: Meeting Follow-Up System

**Date:** 2026-02-08
**Version:** 1.0
**Status:** Ready for Testing

---

## Test Workflow Overview

The main workflow tests the complete journey from user registration through follow-up creation and public viewing.

### Workflow Steps
1. Log in as a new user
2. Set up user's company (sender company)
3. Create prospect companies (receiver companies)
4. Add contacts to prospect companies
5. Create a follow-up linking sender → receiver
6. Publish and share the follow-up
7. View the follow-up as a prospect
8. Verify analytics tracking

---

## 🚨 CRITICAL GAPS IDENTIFIED

### Gap 1: Missing Sender Company Field
**Issue:** The database schema has NO field to store the sender's company.

**Current Schema:**
```prisma
model Followup {
  userId     String  // Clerk user ID (sender)
  companyId  String  // Receiver company
  // ❌ MISSING: senderCompanyId
}
```

**Impact:**
- Cannot identify which company the sender represents
- Cannot display "Follow-up from [Sender Company] to [Receiver Company]"
- Business context is lost

**Required Fix:**
1. Add `senderCompanyId` field to `Followup` model
2. Create migration
3. Update all forms and APIs
4. Update public viewer to show both companies

---

### Gap 2: User's Company (Profile Setup)
**Issue:** No mechanism for users to define "their" company.

**Current State:**
- Users can create many companies (all are treated as prospects)
- No concept of "My Company" vs "Prospect Companies"

**Options to Fix:**

**Option A: User Profile Company (Recommended)**
- Add `companyId` field to user profile/session
- One-time setup: "What company do you represent?"
- All follow-ups default to using this as sender company

**Option B: Company Type Flag**
- Add `type` enum to Company: `OWN | PROSPECT`
- Mark one company as "OWN"
- Use in follow-up creation

**Option C: Per-Followup Selection**
- Add dropdown to follow-up form: "Sending from: [Company dropdown]"
- More flexible but requires selection each time

---

### Gap 3: Public Viewer Missing Sender Context
**Issue:** The public viewer doesn't show WHO sent the follow-up.

**Current Display:**
- Only shows receiver company badge
- No sender company
- No sender name/contact

**Required Changes to PublicViewerPage.tsx:**

Add sender section:
```tsx
{/* Sender Company Badge */}
<div className="mb-6 p-4 bg-white rounded-lg border-2 border-[#D0CCE0]">
  <p className="text-xs text-slate-500 mb-1">Follow-up from</p>
  <div className="flex items-center gap-3">
    {senderCompany.logoUrl && (
      <img src={senderCompany.logoUrl} className="h-10 w-10 rounded-lg" />
    )}
    <div>
      <p className="font-bold text-lg text-[#2E2827]">
        {senderCompany.name}
      </p>
      <p className="text-sm text-slate-600">to {receiverCompany.name}</p>
    </div>
  </div>
</div>
```

---

## Test Cases

### TC-1: First-Time User Setup ⚠️ BLOCKED

**Prerequisites:** None
**Status:** ⚠️ BLOCKED by Gap 1 & Gap 2

**Steps:**
1. Navigate to app URL
2. Click "Sign In" (Clerk)
3. Create new account:
   - Email: `test+$(date +%s)@example.com`
   - Password: `Test123!@#`
4. Complete Clerk onboarding

**Expected:**
- ✅ User sees Clerk auth screen
- ✅ User can create account
- ⚠️ User should be prompted: "What company do you represent?"
- ⚠️ User completes company profile (name, website, logo)

**Actual (Current):**
- ❌ No company setup prompt
- ❌ Lands on empty dashboard
- ❌ User doesn't know to set up "their" company first

**To Test Manually (Workaround):**
1. After signup, go to Companies page
2. Create company representing YOUR organization
3. Note: This company will be treated as a prospect (incorrect)

---

### TC-2: Dashboard After Fresh Signup

**Prerequisites:** TC-1 completed
**Status:** ✅ Can test

**Steps:**
1. View dashboard after signup

**Expected:**
- ✅ Welcome message: "Welcome back, {firstName}!"
- ✅ 3 stat cards: Companies (0), Follow-ups (0), Total Views (0)
- ✅ Empty state: "No follow-ups yet"
- ✅ Quick action buttons: "New Company", "New Follow-up"

**Verification:**
```
✓ Stats show 0 across all cards
✓ Empty state has clear call-to-action
✓ Navigation links work
```

---

### TC-3: Create Prospect Company

**Prerequisites:** User logged in
**Status:** ✅ Can test

**Steps:**
1. Click "Companies" in navigation
2. Click "New Company" button
3. Fill form:
   - Name: "Acme Corporation"
   - Website: "https://acme.com"
   - Industry: "Technology"
   - Description: "Leading provider of enterprise software"
4. Click "Create Company"

**Expected:**
- ✅ Modal opens with form
- ✅ Form validates required fields
- ✅ Success: Modal closes, company appears in grid
- ✅ Company card shows logo placeholder, name, industry

**Verification:**
```
✓ Company appears in list
✓ Can click to view company detail
✓ Edit/Delete actions visible
```

---

### TC-4: Add Contacts to Company

**Prerequisites:** TC-3 completed (Acme Corp exists)
**Status:** ✅ Can test

**Steps:**
1. Go to Companies → Click "Acme Corporation"
2. In Contacts section, click "Add Contact"
3. Fill form:
   - Name: "John Doe"
   - Email: "john.doe@acme.com"
   - Role: "VP of Sales"
   - Phone: "+1-555-0123"
4. Click "Add Contact"
5. Repeat for second contact:
   - Name: "Jane Smith"
   - Email: "jane.smith@acme.com"
   - Role: "Product Manager"

**Expected:**
- ✅ Contact form modal opens
- ✅ Contact saves successfully
- ✅ Contact appears in company detail contacts list
- ✅ Can add multiple contacts

**Verification:**
```
✓ Both contacts visible in list
✓ Contact details display correctly
✓ Edit/Delete actions available
```

---

### TC-5: Create Follow-Up ⚠️ INCOMPLETE

**Prerequisites:**
- TC-3 completed (Acme Corp exists)
- TC-4 completed (Contacts exist)

**Status:** ⚠️ Missing sender company selection

**Steps:**
1. Click "New Follow-up" from dashboard or Follow-ups page
2. Fill "Meeting Details":
   - **⚠️ MISSING: "Sending from: [Your Company]"** (Gap 2)
   - Title: "Acme Partnership Discussion - Q1 2026"
   - Company: Select "Acme Corporation"
   - Meeting Date: Select today's date
   - Meeting Type: "PARTNERSHIP"
   - Location: "Zoom"
3. Click "Next" or switch to "Meeting Recap" tab
4. Write meeting recap:
   ```
   Great discussion about partnership opportunities.

   Key Topics:
   - Integration capabilities
   - Pricing structure
   - Timeline for Q1 rollout
   ```
5. Switch to "Next Steps" tab
6. Add next steps:
   - Action: "Send technical documentation"
   - Owner: "Us"
   - Deadline: 3 days from now
   -
   - Action: "Schedule technical deep-dive"
   - Owner: "Them"
   - Deadline: 1 week from now
7. Click "Save Draft"

**Expected:**
- ✅ Form saves successfully
- ✅ Redirects to follow-up detail page
- ✅ Status shows "DRAFT"
- ⚠️ Should show: "From [Your Company] → To Acme Corporation"

**Actual (Current):**
- ✅ Form works
- ❌ No sender company selection
- ❌ Follow-up detail doesn't show sender company

**Verification:**
```
✓ Draft appears in follow-ups list
✓ Can edit draft
✓ All fields preserved
✗ Sender company not shown
```

---

### TC-6: Publish Follow-Up

**Prerequisites:** TC-5 completed (Draft follow-up exists)
**Status:** ✅ Can test

**Steps:**
1. Open the draft follow-up
2. Review content
3. Click "Publish" button
4. In publish modal:
   - Review auto-generated slug: `acme-corporation-john-doe`
   - Optionally customize slug
   - Click "Publish"

**Expected:**
- ✅ Publish modal appears
- ✅ Slug is auto-generated and editable
- ✅ Validation checks slug uniqueness
- ✅ Success: Status changes to "PUBLISHED"
- ✅ Public URL is generated and copyable
- ✅ "View Public Page" link appears

**Verification:**
```
✓ Status badge shows "Published"
✓ Can copy public URL
✓ Edit button still available (can edit published)
✓ "Unpublish" option available
```

---

### TC-7: View Public Follow-Up Page ⚠️ INCOMPLETE

**Prerequisites:** TC-6 completed (Published follow-up)
**Status:** ⚠️ Missing sender company display (Gap 3)

**Steps:**
1. Copy public URL from follow-up detail
2. Open in **incognito/private window** (no authentication)
3. Navigate to: `/f/acme-corporation-john-doe`

**Expected:**
- ✅ Page loads without requiring login
- ⚠️ Should show: "Follow-up from [Your Company]" (Gap 3)
- ⚠️ Should show: "To: Acme Corporation"
- ✅ Shows title: "Acme Partnership Discussion - Q1 2026"
- ✅ Shows meeting metadata: Date, Location, Type
- ✅ Shows meeting recap with rich text formatting
- ✅ Shows next steps with progress bar
- ✅ Shows completed vs pending steps
- ✅ Footer shows company website link
- ✅ "Print Document" button works

**Actual (Current):**
- ✅ Page loads publicly
- ✅ Shows receiver company badge: "Acme Corporation"
- ❌ No sender company shown
- ❌ Unclear WHO sent this follow-up
- ❌ Missing business context

**Visual Check:**
```
✓ Editorial design (Space Grotesk font)
✓ Responsive layout (mobile-friendly)
✓ Professional appearance
✗ Missing sender company badge/header
✗ Ambiguous sender identity
```

---

### TC-8: Analytics Tracking

**Prerequisites:** TC-7 completed
**Status:** ⚠️ Partial (API may not be fully implemented)

**Steps:**
1. While viewing public page (TC-7):
   - Scroll through meeting recap
   - Click on next steps
   - Hover over company website link
2. Return to authenticated session
3. Go to Follow-up detail page
4. Check analytics section

**Expected:**
- ✅ Page view recorded
- ✅ Time on page tracked
- ✅ Device type detected
- ✅ Section engagement tracked
- 🔄 Analytics visible in dashboard (may not be implemented)

**Current Implementation:**
- ✅ Analytics events table exists (schema)
- ⚠️ Frontend tracking may not be hooked up
- ⚠️ Analytics dashboard not yet built (Phase 7)

**To Verify:**
```sql
-- Check if analytics events are being recorded
SELECT * FROM analytics_events
WHERE followup_id = '[followup-id]'
ORDER BY timestamp DESC;
```

---

### TC-9: Edit Published Follow-Up

**Prerequisites:** TC-6 completed
**Status:** ✅ Can test

**Steps:**
1. Open published follow-up
2. Click "Edit" button
3. Modify meeting recap:
   - Add: "**Update:** Technical docs sent on [date]"
4. Click "Save"
5. Refresh public page (incognito)

**Expected:**
- ✅ Edit button visible on published follow-ups
- ✅ Changes save successfully
- ✅ Public page updates immediately
- ✅ No need to "re-publish"

**Verification:**
```
✓ Updates appear on public page
✓ No broken links
✓ Slug remains unchanged
```

---

### TC-10: Follow-Ups List & Filtering

**Prerequisites:** Multiple follow-ups created
**Status:** ✅ Can test

**Steps:**
1. Go to Follow-ups page
2. Create 2-3 follow-ups (some draft, some published)
3. Test filters:
   - Click "All" tab
   - Click "Drafts" tab
   - Click "Published" tab
4. Test search:
   - Type company name
   - Type meeting type
5. Test pagination (if >12 follow-ups)

**Expected:**
- ✅ All follow-ups listed with cards
- ✅ Filters work correctly
- ✅ Search filters in real-time
- ✅ Pagination appears if >12 items
- ✅ Empty states show for no results

**Verification:**
```
✓ Status badges correct (Draft vs Published)
✓ Company names display
✓ Meeting dates format correctly
✓ Cards link to detail pages
```

---

## Summary of Gaps to Fix

### Priority 1: Critical for MVP

1. **Add Sender Company to Schema**
   - [ ] Add `senderCompanyId` to Followup model
   - [ ] Create migration
   - [ ] Update backend API
   - [ ] Update frontend forms

2. **User Company Profile Setup**
   - [ ] Decide on approach (Option A recommended)
   - [ ] Create onboarding flow: "What company do you represent?"
   - [ ] Store in user profile/settings
   - [ ] Auto-populate in follow-up creation

3. **Update Public Viewer**
   - [ ] Fetch sender company data
   - [ ] Add "From [Sender Company] → To [Receiver Company]" header
   - [ ] Show sender logo (optional)
   - [ ] Make business relationship clear

### Priority 2: Nice to Have

4. **Analytics Implementation**
   - [ ] Hook up frontend analytics tracking
   - [ ] Build analytics dashboard (Phase 7)
   - [ ] Test event recording

5. **Contact Selection in Follow-Up**
   - [ ] Add multi-select for contacts who attended
   - [ ] Display attendees on public page
   - [ ] Highlight "main contact" (recipient)

---

## Testing Checklist

### Prerequisites
- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:3000
- [ ] Database migrated and seeded
- [ ] Clerk auth configured
- [ ] Test mode enabled (test@example.com)

### Test Sequence
- [ ] TC-1: User signup and login
- [ ] TC-2: View dashboard
- [ ] TC-3: Create prospect company
- [ ] TC-4: Add contacts
- [ ] TC-5: Create follow-up draft
- [ ] TC-6: Publish follow-up
- [ ] TC-7: View public page
- [ ] TC-8: Check analytics
- [ ] TC-9: Edit published follow-up
- [ ] TC-10: List & filter follow-ups

### Critical Paths
✅ **Can Test Now:**
- User authentication
- Company CRUD
- Contact CRUD
- Follow-up creation & editing
- Publishing workflow
- Public viewing (partial)

⚠️ **Blocked/Incomplete:**
- Sender company selection
- Sender company display
- Clear business relationship context
- Analytics dashboard

---

## Next Steps

### Immediate (Before Testing)
1. **Fix Critical Gaps:**
   - Implement sender company field
   - Add user company profile setup
   - Update public viewer to show both companies

2. **Prepare Test Environment:**
   - Ensure dev servers running
   - Clear database or use fresh data
   - Test Clerk authentication

### During Testing
1. Follow test cases in sequence
2. Document bugs in GitHub Issues
3. Take screenshots of UI issues
4. Test on mobile + desktop

### After Testing
1. Prioritize bugs by severity
2. Fix critical issues first
3. Re-test fixed issues
4. Prepare for Phase 6 (Deployment)

---

**Last Updated:** 2026-02-08
**Tester:** TBD
**Environment:** Local Development
