#!/bin/bash

# Deployment Script for Meeting Follow-up MVP
# This script helps you deploy to GitHub and Vercel

set -e

echo "🚀 Meeting Follow-up MVP Deployment"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "📦 Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit - Meeting Follow-up MVP

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
  echo "✅ Git repository initialized"
  echo ""
fi

# Check if remote is set
if ! git remote | grep -q "origin"; then
  echo "⚠️  No remote repository found."
  echo ""
  echo "Please create a GitHub repository and run:"
  echo "  git remote add origin https://github.com/YOUR_USERNAME/meeting-followup.git"
  echo "  git push -u origin main"
  echo ""
  echo "Then run this script again."
  exit 1
fi

echo "📤 Pushing to GitHub..."
git push -u origin main
echo "✅ Code pushed to GitHub"
echo ""

echo "🔨 Building applications..."

# Build backend
echo "  Building backend..."
cd apps/backend
npm run build
cd ../..
echo "  ✅ Backend built"

# Build frontend
echo "  Building frontend..."
cd apps/frontend
npm run build
cd ../..
echo "  ✅ Frontend built"

echo ""
echo "✅ Builds completed successfully!"
echo ""

echo "📋 Next Steps:"
echo ""
echo "1. Deploy Backend to Vercel:"
echo "   - Go to https://vercel.com/new"
echo "   - Import your GitHub repository"
echo "   - Add environment variables (see DEPLOYMENT.md)"
echo "   - Deploy"
echo ""
echo "2. Deploy Frontend to Vercel:"
echo "   - Create another Vercel project for frontend"
echo "   - Set root directory to 'apps/frontend'"
echo "   - Add environment variables"
echo "   - Deploy"
echo ""
echo "3. Run database migrations on production:"
echo "   DATABASE_URL=\"your-production-url\" npx prisma migrate deploy"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
