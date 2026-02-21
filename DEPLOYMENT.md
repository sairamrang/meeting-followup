# Deployment Guide - Meeting Follow-up MVP

This guide walks you through deploying your Meeting Follow-up application to production.

**Tech Stack:**
- Frontend: React + Vite → **Vercel**
- Backend: Express + Node.js → **Vercel Serverless Functions** (or Railway/Render)
- Database: PostgreSQL → **Supabase** (already configured)
- Authentication: Clerk

---

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Supabase project (you already have this)
- Clerk account (for authentication)

---

## Step 1: Initialize Git Repository

```bash
cd "/Users/sai.rangachari/Ideas/Meeting follow up"
git init
git add .
git commit -m "Initial commit - Meeting Follow-up MVP

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Step 2: Create GitHub Repository

1. Go to GitHub and create a new repository: https://github.com/new
2. Name it: `meeting-followup` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Create the repository

Then connect your local repo:

```bash
git remote add origin https://github.com/YOUR_USERNAME/meeting-followup.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend API (Option A - Vercel Serverless)

### 3.1 Create `vercel.json` for Backend

The backend needs to be configured as serverless functions. Create this file in the root:

**File: `/vercel.json`** (already created for you)

### 3.2 Set Environment Variables in Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **DO NOT deploy yet** - first configure environment variables
4. Go to Project Settings → Environment Variables
5. Add these variables:

```
DATABASE_URL=postgresql://postgres.kewlnxcpojgbyqzjcgun:iKhA17lG4LUq%21RLZ@aws-0-us-west-2.pooler.supabase.com:5432/postgres
CLERK_PUBLISHABLE_KEY=<get from Clerk dashboard>
CLERK_SECRET_KEY=<get from Clerk dashboard>
NODE_ENV=production
PORT=3001
```

### 3.3 Deploy Backend

```bash
# Deploy backend to Vercel
cd apps/backend
vercel --prod
```

Your backend API will be available at: `https://your-project-backend.vercel.app`

---

## Step 4: Deploy Frontend (Vercel)

### 4.1 Create Environment Variables

Create `.env.production` file in `apps/frontend/`:

```env
VITE_API_URL=https://your-project-backend.vercel.app/api
VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
```

### 4.2 Configure Vercel for Frontend

1. Go to Vercel dashboard
2. Create New Project
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4.3 Add Environment Variables in Vercel

In Project Settings → Environment Variables, add:

```
VITE_API_URL=https://your-project-backend.vercel.app/api
VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
```

### 4.4 Deploy Frontend

Click "Deploy" in Vercel dashboard, or push to GitHub (auto-deploys).

Your frontend will be available at: `https://your-project.vercel.app`

---

## Step 5: Run Database Migration on Production

After backend is deployed, run migrations on Supabase:

```bash
cd apps/backend
DATABASE_URL="postgresql://postgres.kewlnxcpojgbyqzjcgun:iKhA17lG4LUq%21RLZ@aws-0-us-west-2.pooler.supabase.com:5432/postgres" npx prisma migrate deploy
```

This will apply all migrations to your production database.

---

## Step 6: Configure Clerk for Production

1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Create a new application (or use existing)
3. Add your production URLs to allowed origins:
   - Frontend: `https://your-project.vercel.app`
   - Backend: `https://your-project-backend.vercel.app`
4. Copy the Production API keys and update them in Vercel environment variables

---

## Step 7: Update CORS Settings (Backend)

Make sure your backend allows requests from your frontend domain.

In `apps/backend/src/server.ts`, update CORS configuration:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-project.vercel.app', // Add your production frontend URL
  ],
  credentials: true,
}));
```

Commit and push this change to trigger a redeploy.

---

## Step 8: Test Production Deployment

### 8.1 Test Backend API

```bash
curl https://your-project-backend.vercel.app/api/health
```

Expected: `{"status":"ok"}`

### 8.2 Test Frontend

1. Visit: `https://your-project.vercel.app`
2. Sign in with Clerk
3. Create a test company
4. Create a test follow-up
5. Publish it and verify the public URL works

---

## Alternative: Deploy Backend to Railway (Recommended for Express apps)

If you prefer a traditional Node.js server instead of serverless:

### Railway Deployment

1. Go to https://railway.app
2. Create new project → Deploy from GitHub
3. Select your repository
4. Configure:
   - **Root Directory**: `apps/backend`
   - **Start Command**: `npm start`
5. Add environment variables (same as above)
6. Deploy

Railway provides a persistent server which may be better for Express apps.

---

## Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL=<your-supabase-connection-string>
CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
CLERK_SECRET_KEY=<clerk-secret-key>
NODE_ENV=production
PORT=3001
```

### Frontend (.env.production)
```env
VITE_API_URL=<your-backend-url>/api
VITE_CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
```

---

## Post-Deployment Checklist

- [ ] Backend API is accessible and returns 200 OK
- [ ] Frontend loads without errors
- [ ] Clerk authentication works
- [ ] Can create companies
- [ ] Can create contacts
- [ ] Can create follow-ups
- [ ] Can publish follow-ups
- [ ] Public follow-up pages load correctly
- [ ] Analytics tracking works
- [ ] Database migrations are applied

---

## Troubleshooting

### "Module not found" errors on Vercel
- Make sure `package.json` in root has all dependencies
- Ensure `vercel.json` is correctly configured
- Check build logs in Vercel dashboard

### CORS errors
- Add your production frontend URL to backend CORS config
- Ensure environment variables are set correctly

### Database connection errors
- Verify `DATABASE_URL` is correctly set
- Check Supabase connection string includes password
- Ensure migrations are applied: `npx prisma migrate deploy`

### Clerk authentication fails
- Verify Clerk publishable key matches your environment
- Add production URLs to Clerk dashboard allowed origins

---

## Continuous Deployment

Once connected to GitHub, any push to the `main` branch will automatically:
1. Trigger a new deployment on Vercel
2. Run build process
3. Deploy if successful

To deploy to staging first:
1. Create a `staging` branch
2. Connect it to Vercel as a separate project
3. Test on staging before merging to `main`

---

## Monitoring & Logs

- **Vercel Logs**: Dashboard → Your Project → Logs
- **Supabase Logs**: Supabase Dashboard → Logs
- **Backend Logs**: Check Vercel Functions logs for API errors
- **Frontend Errors**: Use browser console or add error tracking (Sentry)

---

## Cost Estimate (Monthly)

- **Vercel**: Free tier (Hobby) supports up to 100GB bandwidth
- **Supabase**: Free tier includes 500MB database, 2GB bandwidth
- **Clerk**: Free tier includes 5,000 monthly active users
- **Total**: $0/month for MVP (scales with usage)

---

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure email notifications
3. Add error tracking (Sentry)
4. Set up monitoring (UptimeRobot)
5. Enable analytics (PostHog, Plausible)

---

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Clerk Documentation: https://clerk.com/docs
