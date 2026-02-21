# API Testing Setup Guide

## Prerequisites

1. Backend server running: `npm run dev` (port 3001)
2. Database migrated: `npx prisma migrate dev`
3. Environment variables configured in `.env`

## Testing Tools

### Option 1: REST Client (VS Code Extension) ⭐ RECOMMENDED

1. Install "REST Client" extension by Huachao Mao
2. Open `api-tests.http` file
3. Click "Send Request" above any endpoint
4. View response inline

### Option 2: Postman

1. Import the requests from `api-tests.http`
2. Set environment variables:
   - `baseUrl`: http://localhost:3001
   - `token`: Your Clerk JWT token
3. Start testing!

### Option 3: Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new requests manually
3. Base URL: http://localhost:3001

## Authentication

The API uses Clerk for authentication. You need a JWT token for protected endpoints.

### 🔓 Development Test Mode (ENABLED)

**In development mode**, you can bypass Clerk authentication using the `x-user-id` header:

```bash
curl -X POST http://localhost:3001/api/companies \
  -H "x-user-id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp"}'
```

**Important:**
- This only works when `NODE_ENV=development` (or not set)
- Any user ID works (e.g., "test-user-123", "john@example.com")
- In production, this bypass is disabled and real Clerk JWT is required
- The console will show: `🔓 Dev mode: Using test user ID: test-user-123`

### Getting a Real Clerk Token (Production)

Once you have the frontend running:
1. Open browser DevTools → Application → Cookies
2. Find the `__session` cookie
3. Or use `await clerk.session.getToken()` in the frontend
4. Replace `x-user-id` header with `Authorization: Bearer <token>`

## Testing Flow

### 1. Health Check (No Auth)
```bash
curl http://localhost:3001/health
```

### 2. Create Company (Dev Mode)
```bash
curl -X POST http://localhost:3001/api/companies \
  -H "x-user-id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","industry":"Technology"}'
```

### 3. Create Follow-up (Dev Mode)
```bash
curl -X POST http://localhost:3001/api/followups \
  -H "x-user-id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "YOUR_COMPANY_ID",
    "title": "Test Meeting",
    "meetingDate": "2024-01-15T14:00:00Z",
    "meetingType": "SALES",
    "meetingRecap": "<p>Great discussion</p>"
  }'
```

### 4. Publish Follow-up (Dev Mode)
```bash
curl -X POST http://localhost:3001/api/followups/YOUR_FOLLOWUP_ID/publish \
  -H "x-user-id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{"slug":"test-meeting"}'
```

### 5. View Published Follow-up (Public - No Auth!)
```bash
curl http://localhost:3001/api/followups/public/test-meeting
```

## Available Endpoints

### Public Endpoints (No Authentication)
- `GET /health` - Health check
- `GET /api/followups/public/:slug` - View published follow-up
- `GET /api/files/public/:slug/files` - Files for published follow-up
- `POST /api/analytics/events` - Track analytics event
- `POST /api/analytics/sessions/start` - Start session
- `POST /api/analytics/sessions/end` - End session

### Protected Endpoints (Require Authentication)
All other endpoints require `Authorization: Bearer <token>` header

#### Companies (6 endpoints)
- POST /api/companies - Create
- GET /api/companies/:id - Get by ID
- GET /api/companies - List with pagination
- PUT /api/companies/:id - Update
- DELETE /api/companies/:id - Delete
- GET /api/companies/:id/stats - Statistics

#### Contacts (5 endpoints)
- POST /api/contacts - Create
- GET /api/contacts/:id - Get by ID
- GET /api/contacts/company/:companyId - List for company
- PUT /api/contacts/:id - Update
- DELETE /api/contacts/:id - Delete

#### Follow-ups (8 endpoints)
- POST /api/followups - Create (draft)
- GET /api/followups/:id - Get by ID
- GET /api/followups - List with filters
- PUT /api/followups/:id - Update (draft only)
- POST /api/followups/:id/publish - Publish
- POST /api/followups/:id/unpublish - Unpublish
- DELETE /api/followups/:id - Delete

#### Library (5 endpoints)
- POST /api/library - Create
- GET /api/library/:id - Get by ID
- GET /api/library - List (grouped or filtered)
- PUT /api/library/:id - Update
- DELETE /api/library/:id - Delete

#### Company Content (5 endpoints)
- POST /api/company-content - Create
- GET /api/company-content/:id - Get by ID
- GET /api/company-content/company/:companyId - List (grouped)
- PUT /api/company-content/:id - Update
- DELETE /api/company-content/:id - Delete

#### Templates (6 endpoints)
- POST /api/templates - Create
- GET /api/templates/:id - Get by ID
- GET /api/templates/slug/:slug - Get by slug
- GET /api/templates - List all
- PUT /api/templates/:id - Update
- DELETE /api/templates/:id - Delete

#### Files (5 endpoints)
- POST /api/files - Create record
- GET /api/files/:id - Get by ID
- GET /api/files/followup/:followupId - List for follow-up
- PUT /api/files/:id - Update
- DELETE /api/files/:id - Delete

#### Analytics (2 endpoints)
- GET /api/analytics/followups/:id - Follow-up analytics
- GET /api/analytics/summary - Summary for all follow-ups

## Next Steps

1. Start the server: `cd apps/backend && npm run dev`
2. Choose your testing tool (REST Client recommended)
3. Update the token in `api-tests.http`
4. Start testing endpoints!

## Troubleshooting

### "Authentication required" error
- Make sure you have a valid Clerk JWT token
- Or enable development test mode (ask me to add it)

### "Company not found" error
- Create a company first before creating contacts/follow-ups
- Use the returned ID in subsequent requests

### CORS errors
- The backend allows requests from `http://localhost:5173`
- Update CORS settings in `server.ts` if using different port

### Database errors
- Run `npx prisma migrate dev` to ensure migrations are applied
- Check `.env` file has correct `DATABASE_URL`
