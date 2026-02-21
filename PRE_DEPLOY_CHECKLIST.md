# Pre-Deployment Checklist

Complete this checklist before deploying to production.

---

## ✅ Code Quality

- [x] All backend tests passing
- [x] Database migrations created and tested
- [x] Frontend builds without errors
- [x] No console errors in browser
- [x] TypeScript types are correct (no `any` types in critical code)

## ✅ Security

- [x] Environment variables not hardcoded
- [x] `.env` files in `.gitignore`
- [x] Supabase connection string secured
- [x] CORS configured for production domains
- [x] Authentication implemented (Clerk)
- [x] API endpoints protected with auth middleware

## ✅ Database

- [x] Migrations directory exists: `apps/backend/prisma/migrations/`
- [x] Latest migration includes all schema changes
- [x] Migration tested on development database
- [x] Supabase production database ready

## ✅ Backend API

- [x] Server runs on `http://localhost:3001`
- [x] Health endpoint works: `/health`
- [x] All API endpoints tested:
  - [x] POST /api/companies
  - [x] GET/POST /api/contacts
  - [x] GET/POST/PUT /api/followups
  - [x] POST /api/followups/:id/publish
  - [x] GET /api/followups/public/:slug
  - [x] GET /api/analytics/followups/:id
- [x] CORS allows frontend URL
- [x] Error handling works (try invalid requests)

## ✅ Frontend

- [x] App runs on `http://localhost:5173`
- [x] Authentication flow works
- [x] All main features tested:
  - [x] Onboarding modal (first company creation)
  - [x] Company management
  - [x] Contact management
  - [x] Follow-up creation
  - [x] Follow-up editing
  - [x] Follow-up publishing
  - [x] Public viewer page
  - [x] Analytics display
- [x] Form validation works
- [x] Error messages display correctly
- [x] Loading states work

## ✅ Configuration Files

- [x] `package.json` files exist in:
  - [x] Root directory
  - [x] `apps/backend/`
  - [x] `apps/frontend/`
  - [x] `packages/shared/`
- [x] `.gitignore` includes:
  - [x] `node_modules/`
  - [x] `.env` files
  - [x] `dist/` and `build/`
- [x] `vercel.json` configured (created)
- [x] `tsconfig.json` files present and valid

## ✅ Environment Variables

### Backend (.env)
```env
✓ DATABASE_URL
✓ NODE_ENV
✓ PORT
⏳ CLERK_PUBLISHABLE_KEY (need to get from Clerk)
⏳ CLERK_SECRET_KEY (need to get from Clerk)
⏳ FRONTEND_URL (will be set after frontend deployment)
```

### Frontend (.env)
```env
✓ VITE_API_URL (currently localhost, will change to production)
⏳ VITE_CLERK_PUBLISHABLE_KEY (need to get from Clerk)
```

## ✅ Documentation

- [x] `README.md` (if needed)
- [x] `DEPLOYMENT.md` (comprehensive guide)
- [x] `QUICKSTART_DEPLOY.md` (10-minute guide)
- [x] `TESTING_SUMMARY.md` (test results)
- [x] This checklist

## ✅ Git & GitHub

- [ ] Git repository initialized
- [ ] All files added and committed
- [ ] Sensitive files NOT in repo (.env, etc.)
- [ ] GitHub repository created
- [ ] Remote origin configured
- [ ] Code pushed to GitHub

## ⏳ External Services Setup

### Clerk (Authentication)
- [ ] Clerk account created
- [ ] New application created
- [ ] Authentication methods chosen (Email, Google, etc.)
- [ ] API keys copied (Publishable + Secret)

### Vercel (Hosting)
- [ ] Vercel account created
- [ ] GitHub connected to Vercel

### Supabase (Database)
- [x] Supabase project exists
- [x] Database connection string available
- [ ] Ready for production migrations

---

## Final Checks Before Deploy

### Test Workflow End-to-End

Run the test script to verify everything works:

```bash
cd "/Users/sai.rangachari/Ideas/Meeting follow up"
bash test-workflow.sh
```

Expected: All 8 tests pass ✅

### Build Test

```bash
# Build backend
cd apps/backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

Both should complete without errors.

### Clean Install Test

```bash
# Remove node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

Should install without errors.

---

## Ready to Deploy? ✅

If all checkboxes above are checked, you're ready to proceed with:

1. **QUICKSTART_DEPLOY.md** - Fast deployment (10 minutes)
2. **DEPLOYMENT.md** - Comprehensive guide with troubleshooting

---

## Not Ready Yet?

Common issues to fix:

### ❌ Tests Failing
→ Run `bash test-workflow.sh` and fix failing endpoints

### ❌ Build Errors
→ Check TypeScript errors: `npm run build` in each app

### ❌ Missing Environment Variables
→ Create `.env` files with all required variables

### ❌ Git Not Initialized
→ Run `git init` in project root

### ❌ CORS Errors
→ Update `apps/backend/src/server.ts` CORS config

---

## Questions?

- Backend API not responding? Check `apps/backend/src/server.ts`
- Frontend not loading? Check `apps/frontend/src/main.tsx`
- Database issues? Check Supabase dashboard
- Authentication failing? Verify Clerk setup

**Once everything is ✅, proceed to deployment!**
