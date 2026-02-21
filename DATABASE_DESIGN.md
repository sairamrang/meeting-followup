# Enhanced Database Design

## 📊 Overview

The Meeting Follow-Up System uses an enhanced relational database with **10 tables** that support:
- Company and contact management
- Meeting follow-up creation and publishing
- Dynamic content assembly
- File attachments
- Analytics tracking

**Total Tables:** 10 (enhanced from original 6)
**Database:** PostgreSQL 15+ via Supabase
**ORM:** Prisma 5.x

---

## 🎯 Core Data Flow

```
User (Clerk Auth)
    ↓ creates/manages
Companies (prospect companies)
    ↓ has
Contacts (people at companies)
    ↓ attends
Followups (meeting records)
    ↓ references
Library + CompanyContent (reusable content)
    ↓ includes
Files (attachments)
    ↓ generates
Public URL (slug-based)
    ↓ tracks
Analytics (engagement metrics)
```

---

## 📋 Table Breakdown

### **1. Companies** (New ✨)

Central repository for prospect/partner companies with reusable data.

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `name` | String | Company name (e.g., "Acme Corporation") |
| `website` | String? | Company website URL |
| `industry` | String? | Industry category |
| `description` | Text? | Brief company overview |
| `logoUrl` | String? | Company logo for branding |
| `createdBy` | String | User who added this company |
| `createdAt`, `updatedAt` | Timestamp | Audit trail |

**Relations:**
- Has many `followups` (all meetings with this company)
- Has many `contacts` (people at this company)
- Has many `companyContent` (company-specific content)

**Benefits:**
- Reuse company data across multiple follow-ups
- Track all interactions with a company
- Build company profiles over time

---

### **2. Contacts** (New ✨)

People at prospect companies with proper contact management.

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `companyId` | UUID | Foreign key → companies |
| `name` | String | Contact name |
| `email` | String? | Email address |
| `phone` | String? | Phone number |
| `role` | String? | Job title (e.g., "VP Sales") |
| `linkedinUrl` | String? | LinkedIn profile |
| `createdAt`, `updatedAt` | Timestamp | Audit trail |

**Relations:**
- Belongs to one `company`
- Has many `followupContacts` (meeting attendance records)

**Benefits:**
- Proper contact normalization (no JSONB)
- Reuse contacts across multiple follow-ups
- Track contact engagement history

---

### **3. Followups** (Enhanced)

Core entity for meeting follow-ups with improved structure.

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `userId` | String | Clerk user ID (sales rep who created) |
| `companyId` | UUID | **New:** Foreign key → companies |
| `status` | Enum | DRAFT or PUBLISHED |
| `slug` | String? | Unique URL slug (e.g., "acme-q1-partnership") |
| `title` | String | Follow-up title |
| `meetingDate` | Date | When meeting happened |
| `meetingType` | Enum | SALES, PARTNERSHIP, DEMO, DISCOVERY, TECHNICAL, OTHER |
| `meetingLocation` | String? | **New:** "Zoom", "Their Office", etc. |
| `meetingRecap` | Text? | Rich text meeting notes |
| `meetingNotesUrl` | String? | **New:** External link (Google Docs, Notion) |
| `nextSteps` | JSONB? | Action items array |
| `contentRefs` | JSONB? | Library/company content IDs to include |
| `contentOverrides` | JSONB? | Custom content overrides |
| `createdAt`, `updatedAt`, `publishedAt` | Timestamp | Audit trail |

**Relations:**
- Belongs to one `company`
- Has many `followupContacts` (attendees)
- Has many `files` (attachments)
- Has many `analyticsEvents` and `analyticsSessions`

**Key Enhancements:**
- ✅ Links to companies (not just string name)
- ✅ External meeting notes URL support
- ✅ Meeting location tracking
- ✅ More meeting types (DISCOVERY, TECHNICAL)

---

### **4. FollowupContact** (New ✨)

Junction table linking follow-ups to contacts (many-to-many).

| Field | Type | Purpose |
|-------|------|---------|
| `followupId` | UUID | Foreign key → followups |
| `contactId` | UUID | Foreign key → contacts |
| `attended` | Boolean | Did they actually attend? |

**Composite Primary Key:** `(followupId, contactId)`

**Benefits:**
- Track which contacts attended which meetings
- Query all meetings for a specific contact
- Mark attendance (invited vs. attended)

---

### **5. CompanyContent** (New ✨)

Company-specific content (history, leadership, products) stored per company.

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `companyId` | UUID? | Foreign key → companies (NULL for global) |
| `type` | Enum | HISTORY, LEADERSHIP, PRODUCTS, NEWS, NOTES |
| `title` | String | Content title |
| `content` | Text | Rich text HTML |
| `sortOrder` | Int? | Display order |
| `createdBy` | String | User who created |
| `createdAt`, `updatedAt` | Timestamp | Audit trail |

**Content Types:**
- `HISTORY`: Prospect company background
- `LEADERSHIP`: Executives/leadership team
- `PRODUCTS`: Their product/service info
- `NEWS`: Recent company news/updates
- `NOTES`: Internal sales notes about prospect

**Benefits:**
- Store research about prospect companies
- Reuse content across follow-ups with same company
- Build knowledge base about prospects over time

---

### **6. Library** (Enhanced)

Global reusable content about **your company** (not prospects).

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `type` | Enum | ABOUT_US, VALUE_PROP, CASE_STUDY, TEAM_BIO, PRODUCT, PRICING |
| `title` | String | Content title |
| `content` | Text | Rich text HTML |
| `sortOrder` | Int? | **New:** Display order |
| `createdBy` | String | User who created |
| `createdAt`, `updatedAt` | Timestamp | Audit trail |

**Content Types:**
- `ABOUT_US`: Company history, mission, vision
- `VALUE_PROP`: Why choose us, differentiators
- `CASE_STUDY`: Customer success stories
- `TEAM_BIO`: Leadership bios
- `PRODUCT`: Product information
- `PRICING`: Pricing information

**Benefits:**
- Create once, reuse in all follow-ups
- Consistent messaging across all prospects
- Easy content updates (change once, applies everywhere)

---

### **7. Templates** (Enhanced)

Pre-built follow-up templates for common meeting types.

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `name` | String | Template name |
| `slug` | String | Unique slug |
| `description` | Text? | Template description |
| `structure` | JSONB | Default sections and content |
| `createdAt`, `updatedAt` | Timestamp | **New:** Audit trail |

**Example Templates:**
```json
{
  "name": "Sales Discovery Call",
  "slug": "sales-discovery",
  "structure": {
    "sections": [
      { "type": "recap", "title": "Meeting Summary" },
      { "type": "nextSteps", "title": "Action Items" },
      { "type": "aboutUs", "title": "About Our Company" },
      { "type": "pricing", "title": "Pricing Options" }
    ]
  }
}
```

---

### **8. Files** (Enhanced)

File attachments (PDFs, presentations, etc.) linked to follow-ups.

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `followupId` | UUID | Foreign key → followups |
| `filename` | String | Original filename |
| `fileSize` | Int | Bytes |
| `mimeType` | String | MIME type |
| `storagePath` | String | Supabase Storage path |
| `storageUrl` | String | Public CDN URL |
| `description` | Text? | **New:** Optional description |
| `uploadedAt` | Timestamp | Upload timestamp |

**Supported Use Cases:**
- Meeting recording PDFs
- Presentation slides
- Product documentation
- Case study PDFs
- Pricing sheets

---

### **9. AnalyticsEvents** (Enhanced)

Individual tracking events for prospect engagement.

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `followupId` | UUID | Foreign key → followups |
| `sessionId` | String | Visitor session ID |
| `eventType` | Enum | PAGE_VIEW, SECTION_VIEW, FILE_DOWNLOAD, LINK_CLICK, COPY_EMAIL, COPY_PHONE |
| `eventData` | JSONB? | Event metadata |
| `deviceType` | Enum | MOBILE, TABLET, DESKTOP |
| `browser` | String? | Browser name |
| `locationCity`, `locationCountry` | String? | Geo-location |
| `ipHash` | String | SHA-256 hashed IP (GDPR-safe) |
| `timestamp` | Timestamp | Event time |

**Enhanced Event Types:**
- `COPY_EMAIL`: Prospect copied contact email
- `COPY_PHONE`: Prospect copied contact phone

**Privacy:**
- IP addresses are SHA-256 hashed (not stored raw)
- No PII stored
- GDPR-compliant

---

### **10. AnalyticsSessions**

Aggregated session data for visitor engagement.

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `followupId` | UUID | Foreign key → followups |
| `sessionStart`, `sessionEnd` | Timestamp | Session duration |
| `pageDuration` | Int? | Total time spent (seconds) |
| `deviceType`, `browser`, `location` | ... | Device/location info |

---

## 🔄 Example Usage Flow

### Scenario: Create Follow-Up for Acme Corp

**Step 1: Create or Find Company**
```sql
-- Create company (if doesn't exist)
INSERT INTO companies (name, website, industry, created_by)
VALUES ('Acme Corporation', 'https://acme.com', 'Software', 'user_123');
```

**Step 2: Add Contacts**
```sql
-- Add contacts to company
INSERT INTO contacts (company_id, name, email, role)
VALUES
  ('company_uuid', 'John Doe', 'john@acme.com', 'VP Sales'),
  ('company_uuid', 'Jane Smith', 'jane@acme.com', 'CTO');
```

**Step 3: Create Follow-Up (Draft)**
```sql
INSERT INTO followups (
  user_id, company_id, title, meeting_date, meeting_type, status
)
VALUES (
  'user_123', 'company_uuid',
  'Partnership Discussion - Q1 2026',
  '2026-01-29', 'PARTNERSHIP', 'DRAFT'
);
```

**Step 4: Link Attendees**
```sql
INSERT INTO followup_contacts (followup_id, contact_id, attended)
VALUES
  ('followup_uuid', 'john_contact_uuid', true),
  ('followup_uuid', 'jane_contact_uuid', true);
```

**Step 5: Add Company Research**
```sql
-- Add prospect company history
INSERT INTO company_content (
  company_id, type, title, content, created_by
)
VALUES (
  'company_uuid', 'HISTORY',
  'Acme Corporation History',
  '<p>Founded in 1995, Acme has grown from...</p>',
  'user_123'
);
```

**Step 6: Reference Your Company Content**
```sql
-- Reference your library content in follow-up
UPDATE followups
SET content_refs = jsonb_build_object(
  'aboutUs', 'library_uuid_about_us',
  'caseStudies', jsonb_build_array('library_uuid_case_study_1'),
  'teamBios', jsonb_build_array('library_uuid_ceo', 'library_uuid_cto')
)
WHERE id = 'followup_uuid';
```

**Step 7: Publish Follow-Up**
```sql
UPDATE followups
SET
  status = 'PUBLISHED',
  slug = 'acme-partnership-q1-2026',
  published_at = NOW()
WHERE id = 'followup_uuid';
```

**Generated URL:**
```
https://yoursite.com/f/acme-partnership-q1-2026
```

**Step 8: Track Engagement**
```sql
-- When prospect views the page
INSERT INTO analytics_events (
  followup_id, session_id, event_type,
  device_type, ip_hash
)
VALUES (
  'followup_uuid', 'session_123', 'PAGE_VIEW',
  'DESKTOP', 'sha256_hash'
);

-- When they download a file
INSERT INTO analytics_events (
  followup_id, session_id, event_type, event_data
)
VALUES (
  'followup_uuid', 'session_123', 'FILE_DOWNLOAD',
  jsonb_build_object('fileId', 'file_uuid', 'filename', 'pricing.pdf')
);
```

---

## 🎨 Benefits of Enhanced Design

### Before (Original 6 Tables)
```
❌ Company data duplicated across follow-ups
❌ Contacts stored as JSONB (no proper queries)
❌ No company profiles or history tracking
❌ No external meeting notes link
❌ Limited meeting types
```

### After (Enhanced 10 Tables)
```
✅ Companies table - Reusable company data
✅ Contacts table - Proper contact management
✅ CompanyContent table - Prospect research storage
✅ FollowupContact junction - Many-to-many attendance
✅ External meeting notes URL support
✅ Enhanced analytics (email/phone copy tracking)
✅ Better content organization (Library vs CompanyContent)
✅ More meeting types (DISCOVERY, TECHNICAL)
✅ Meeting location tracking
```

---

## 📊 Database Statistics

| Category | Count | Details |
|----------|-------|---------|
| **Tables** | 10 | Core: 5, Content: 3, Files: 1, Analytics: 2 |
| **Enums** | 6 | Status, Meeting, Library, Company Content, Event, Device |
| **Indexes** | 15 | Optimized for common queries |
| **Foreign Keys** | 9 | Enforced referential integrity |
| **Cascade Deletes** | 7 | Automatic cleanup on company/followup delete |

---

## 🔍 Query Patterns

### Get all follow-ups for a company
```typescript
const followups = await prisma.followup.findMany({
  where: { companyId: 'company_uuid' },
  include: {
    followupContacts: {
      include: { contact: true }
    },
    files: true
  },
  orderBy: { meetingDate: 'desc' }
});
```

### Get all meetings a contact attended
```typescript
const meetings = await prisma.followupContact.findMany({
  where: { contactId: 'contact_uuid' },
  include: {
    followup: {
      include: { company: true }
    }
  }
});
```

### Get company with all content
```typescript
const company = await prisma.company.findUnique({
  where: { id: 'company_uuid' },
  include: {
    contacts: true,
    companyContent: {
      orderBy: { sortOrder: 'asc' }
    },
    followups: {
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' }
    }
  }
});
```

---

## 🚀 Next Steps

Now that the enhanced database is deployed, we'll proceed to:

1. **Task 1.3**: Create shared TypeScript types matching this schema
2. **Task 1.4**: Create JSON fixtures with sample companies, contacts, and follow-ups
3. **Task 1.5**: Build backend services (CompanyService, ContactService, FollowupService)
4. **Task 1.6**: Create REST API endpoints for all entities

---

**Last Updated:** 2026-01-29
**Schema Version:** Enhanced v2.0
**Database:** PostgreSQL 15+ via Supabase
