# Backend Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name:** meeting-followup-system
   - **Database Password:** (generate strong password - save it!)
   - **Region:** Choose closest to your location
   - **Pricing Plan:** Free tier is fine for development
4. Wait 2-3 minutes for project to be created

## Step 2: Get Supabase Credentials

Once your project is ready:

### Database Connection String
1. Go to **Project Settings** → **Database**
2. Scroll to **Connection string** → **URI**
3. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
4. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with the password you created in Step 1

### API Keys
1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGci...`)
   - **service_role key** (starts with `eyJhbGci...` - keep this secret!)

### Storage Bucket
1. Go to **Storage** in left sidebar
2. Click **New bucket**
3. Name it: `followup-files`
4. Make it **Private** (we'll use signed URLs)
5. Click **Create bucket**

## Step 3: Update .env File

Open `apps/backend/.env` and replace the placeholder values:

```bash
# Replace with your Supabase connection string from Step 2
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"

# Supabase credentials from Step 2
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SERVICE_KEY="eyJhbGci..."
SUPABASE_STORAGE_BUCKET="followup-files"
```

## Step 4: Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and sign up/login
2. Click "Add application"
3. Choose application type: **Web Application**
4. Name it: **Meeting Follow-Up System**
5. Select authentication methods:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ GitHub (optional)
6. Click **Create application**

### Get Clerk Keys
1. In the Clerk dashboard, go to **API Keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

### Update .env File
```bash
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

## Step 5: Run Database Migrations

Once your `.env` file is configured:

```bash
# Navigate to backend directory
cd apps/backend

# Generate Prisma Client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view database
npx prisma studio
```

## Step 6: Verify Setup

Check that everything is working:

```bash
# Should show 8 tables created
npx prisma db push

# Start backend server
npm run dev
```

If you see `Server running on http://localhost:3001`, you're all set! ✅

## Troubleshooting

### "Error: P1001: Can't reach database server"
- Check your `DATABASE_URL` is correct
- Make sure Supabase project is running (not paused)
- Verify password in connection string is correct

### "Error: Invalid API key"
- Double-check your Clerk keys in `.env`
- Make sure you copied the entire key (they're very long)

### SSL certificate errors
- Add `?sslmode=require` to the end of your `DATABASE_URL`

## Next Steps

After setup is complete:
- ✅ Database schema is created
- ✅ Prisma Client is generated
- ✅ Authentication is configured
- ✅ Storage bucket is ready

You can now proceed to **Task 1.3: Prisma Schema** (already done!) and **Task 1.4: Authentication Setup**.
