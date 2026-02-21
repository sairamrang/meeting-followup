# Fixtures - Sample Data

This directory contains sample data for development and testing.

## 📊 Fixture Files

| File | Records | Description |
|------|---------|-------------|
| **companies.json** | 5 | Sample prospect companies across different industries |
| **contacts.json** | 10 | Contacts (2 per company) with roles and contact info |
| **library.json** | 8 | Your company's reusable content (About Us, Case Studies, Team Bios, etc.) |
| **company-content.json** | 8 | Prospect research and sales notes |
| **templates.json** | 5 | Pre-built follow-up templates for different meeting types |
| **followups.json** | 5 | Sample follow-ups (3 published, 2 draft) |
| **files.json** | 10 | File attachments linked to follow-ups |

## 🎯 Data Overview

### Companies
- **Acme Corporation** - Software/Supply Chain (Enterprise)
- **TechVentures Inc** - AI/Analytics Startup (Fast Growth)
- **GlobalHealth Solutions** - Healthcare Technology (Regulated)
- **RetailMax Group** - Multi-Channel Retail (500+ stores)
- **FinanceFirst Partners** - Financial Services (High Security Requirements)

### Follow-ups
1. **Acme - Discovery Call** (Published) - Initial discovery with strong interest
2. **TechVentures - Partnership** (Published) - Integration partnership discussion
3. **GlobalHealth - Product Demo** (Draft) - Healthcare compliance focus
4. **RetailMax - Initial Meeting** (Draft) - Digital transformation opportunity
5. **FinanceFirst - Technical Deep Dive** (Published) - Security architecture review

### Library Content
- **About Us:** Company history and mission
- **Value Props:** Why choose us (ROI, expertise, support)
- **Case Studies:** 2 success stories (Retail, Healthcare)
- **Team Bios:** CEO and CTO profiles
- **Product Info:** Platform overview and technical specs
- **Pricing:** Pricing tiers and plans

## 🔧 Loading Fixtures

### Option 1: Seed Script (Recommended)

```bash
cd apps/backend
npm run seed
```

This will:
1. Clear existing data (in development only)
2. Load all fixtures in correct order (respecting foreign keys)
3. Create relationships (followup_contacts)
4. Report summary of loaded data

### Option 2: Manual Import (Prisma Studio)

```bash
cd apps/backend
npx prisma studio
```

Then manually import JSON data through the UI.

### Option 3: API Endpoints

Once the backend is running, use POST endpoints:

```bash
# Load companies
curl -X POST http://localhost:3001/api/seed/companies

# Load all fixtures
curl -X POST http://localhost:3001/api/seed/all
```

## 📝 Fixture Data Structure

### Realistic Data
- Valid email formats
- Realistic phone numbers (US format with +1)
- Proper company websites
- LinkedIn URLs
- Meeting notes with HTML formatting
- Action items with owners and deadlines
- Content references linking library and company content

### IDs
All records use predictable IDs for easy reference:
- `company-1`, `company-2`, etc.
- `contact-1`, `contact-2`, etc.
- `followup-1`, `followup-2`, etc.
- `library-1`, `library-2`, etc.

This makes it easy to reference data in tests and development.

### Relationships
- Each company has 2 contacts
- Each follow-up is linked to a company
- Follow-ups reference library and company content
- Files are attached to specific follow-ups
- Next steps include action items with completion status

## 🧪 Testing Scenarios

### Scenario 1: Published Follow-up
Use `followup-1` (Acme Discovery) to test:
- Public page rendering
- Content assembly (library + company content)
- File downloads
- Analytics tracking
- Next steps display

### Scenario 2: Draft Follow-up
Use `followup-3` (GlobalHealth Demo) to test:
- Draft editing
- Publishing workflow
- Slug generation
- Status transitions

### Scenario 3: Company Management
Use `company-1` (Acme) to test:
- Company profile page
- Contact management
- Multiple follow-ups per company
- Company content creation

### Scenario 4: Content Library
Use library items to test:
- Content reuse across follow-ups
- Content overrides
- Grouped content display by type
- Content editing and versioning

## 🔄 Resetting Data

To reset the database to fixture data:

```bash
cd apps/backend
npm run seed:reset
```

This will:
1. Drop all data
2. Reload all fixtures
3. Verify data integrity

## 📚 Customizing Fixtures

To add your own fixture data:

1. **Follow the existing structure** - Use the same field names and types
2. **Maintain relationships** - Ensure foreign keys reference valid IDs
3. **Use realistic data** - Makes testing more meaningful
4. **Update this README** - Document your additions

### Example: Adding a New Company

```json
{
  "id": "company-6",
  "name": "Your Company Name",
  "website": "https://yourcompany.example.com",
  "industry": "Your Industry",
  "description": "Brief description",
  "logoUrl": "https://via.placeholder.com/200x200/HEX/FFFFFF?text=YC",
  "createdBy": "user_demo_123",
  "createdAt": "2026-01-XX",
  "updatedAt": "2026-01-XX"
}
```

Then add contacts for that company in `contacts.json`.

## 🎨 Sample URLs Generated

With these fixtures, you'll have these public URLs:

- `yoursite.com/f/acme-discovery-jan-2026`
- `yoursite.com/f/techventures-partnership-jan-2026`
- `yoursite.com/f/financefirst-technical-jan-2026`

(Draft follow-ups won't have public URLs until published)

## ⚠️ Important Notes

- **Development Only:** These fixtures are for development/testing only
- **Placeholder URLs:** File storage URLs are placeholders (will need actual Supabase URLs)
- **User IDs:** All records use `user_demo_123` - replace with actual Clerk user IDs in production
- **Timestamps:** Use ISO 8601 format (e.g., `2026-01-27T16:00:00Z`)
- **Foreign Keys:** Load data in order: companies → contacts → library/company-content → followups → files

## 🚀 Next Steps

After loading fixtures:

1. **Start the backend:** `npm run dev`
2. **View in Prisma Studio:** `npx prisma studio`
3. **Test API endpoints:** Use the follow-ups to test CRUD operations
4. **Build UI:** Use this data to develop frontend components
5. **Run tests:** Write tests against this fixture data

---

**Last Updated:** 2026-01-29
**Total Records:** 5 companies, 10 contacts, 8 library items, 8 company content, 5 templates, 5 follow-ups, 10 files
