# Quick Start Deployment - 10 Minutes

Follow these steps to deploy your Meeting Follow-up MVP to production.

---

## Prerequisites ✓

You already have:
- ✅ Supabase database (connected and working)
- ✅ Application built and tested locally
- ✅ All features working

You need:
- [ ] GitHub account
- [ ] Vercel account (free: https://vercel.com/signup)
- [ ] Clerk account for authentication (free: https://clerk.com)

---

## Step 1: Push to GitHub (5 minutes)

### 1.1 Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `meeting-followup`
3. **Private** or Public (your choice)
4. **DO NOT** initialize with README
5. Click "Create repository"

### 1.2 Push Your Code

```bash
cd "/Users/sai.rangachari/Ideas/Meeting follow up"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Meeting Follow-up MVP

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/meeting-followup.git
git branch -M main
git push -u origin main
```

✅ **Done!** Your code is now on GitHub.

---

## Step 2: Deploy Backend to Vercel (3 minutes)

### 2.1 Create Backend Project

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `meeting-followup` repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`

### 2.2 Add Environment Variables

Before deploying, click "Environment Variables" and add:

```env
DATABASE_URL=postgresql://postgres.kewlnxcpojgbyqzjcgun:iKhA17lG4LUq%21RLZ@aws-0-us-west-2.pooler.supabase.com:5432/postgres
NODE_ENV=production
PORT=3001
```

*Note: We'll add Clerk keys in Step 4*

### 2.3 Deploy

Click "Deploy" and wait ~2 minutes.

✅ **Done!** Note your backend URL: `https://your-project-backend.vercel.app`

---

## Step 3: Deploy Frontend to Vercel (2 minutes)

### 3.1 Create Frontend Project

1. Go to: https://vercel.com/new
2. Import the same repository again
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`

### 3.2 Add Environment Variables

Click "Environment Variables" and add:

```env
VITE_API_URL=https://your-project-backend.vercel.app/api
```

*Note: Replace `your-project-backend` with your actual backend URL from Step 2*

*We'll add Clerk key in Step 4*

### 3.3 Deploy

Click "Deploy" and wait ~2 minutes.

✅ **Done!** Your app is live at: `https://your-project.vercel.app`

---

## Step 4: Setup Clerk Authentication (5 minutes)

### 4.1 Create Clerk Application

1. Go to: https://dashboard.clerk.com
2. Create new application
3. Name: "Meeting Follow-up"
4. Choose authentication methods (Email + Google recommended)

### 4.2 Configure Allowed Origins

In Clerk Dashboard → Settings → Domains:

Add these URLs:
- `http://localhost:5173` (development)
- `https://your-project.vercel.app` (production frontend)
- `https://your-project-backend.vercel.app` (production backend)

### 4.3 Get API Keys

In Clerk Dashboard → API Keys:
- Copy "Publishable Key" (starts with `pk_`)
- Copy "Secret Key" (starts with `sk_`)

### 4.4 Add Clerk Keys to Vercel

**Backend** (your-project-backend on Vercel):
- Go to Settings → Environment Variables
- Add: `CLERK_SECRET_KEY` = `sk_...`
- Add: `CLERK_PUBLISHABLE_KEY` = `pk_...`
- Redeploy

**Frontend** (your-project on Vercel):
- Go to Settings → Environment Variables
- Add: `VITE_CLERK_PUBLISHABLE_KEY` = `pk_...`
- Redeploy

✅ **Done!** Authentication is configured.

---

## Step 5: Run Database Migration on Production (1 minute)

From your local terminal:

```bash
cd "/Users/sai.rangachari/Ideas/Meeting follow up/apps/backend"

DATABASE_URL="postgresql://postgres.kewlnxcpojgbyqzjcgun:iKhA17lG4LUq%21RLZ@aws-0-us-west-2.pooler.supabase.com:5432/postgres" npx prisma migrate deploy
```

✅ **Done!** Database is ready for production.

---

## Step 6: Test Your Deployment

### 6.1 Test Backend API

Open: `https://your-project-backend.vercel.app/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-02-08T...",
  "environment": "production"
}
```

### 6.2 Test Frontend

1. Visit: `https://your-project.vercel.app`
2. Sign up / Sign in with Clerk
3. Create a test company
4. Create a test follow-up
5. Publish it
6. Visit the public URL

✅ **Done!** Everything is working!

---

## Common Issues

### "Module not found" on Vercel
→ Make sure root directory is set correctly (`apps/backend` or `apps/frontend`)

### CORS errors
→ Add `FRONTEND_URL` environment variable to backend:
```env
FRONTEND_URL=https://your-project.vercel.app
```

### Database connection fails
→ Check `DATABASE_URL` is correctly set in Vercel environment variables

### Clerk authentication fails
→ Verify production URLs are added to Clerk allowed origins

---

## What You Get (Free Tier)

✅ **Vercel**: 100GB bandwidth/month, unlimited requests
✅ **Supabase**: 500MB database, 2GB bandwidth/month
✅ **Clerk**: 5,000 active users/month
✅ **Total Cost**: $0/month for MVP usage

---

## Next Steps

- [ ] Add custom domain (optional)
- [ ] Set up monitoring (https://uptimerobot.com - free)
- [ ] Configure backups (Supabase has automatic backups)
- [ ] Add error tracking (https://sentry.io - free tier)

---

## Need Help?

📖 Full guide: See `DEPLOYMENT.md`
🔧 Issues: Check Vercel logs in dashboard
💬 Support: Vercel has excellent documentation

---

**You're live! 🎉**

Share your public follow-up URLs with prospects and track their engagement in real-time.
