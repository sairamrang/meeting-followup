# Meeting Follow-Up Frontend

React SPA for creating and managing meeting follow-ups with analytics.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env and add your Clerk Publishable Key

# Start development server
npm run dev
```

## Tech Stack

- **React 18** + TypeScript
- **Vite** for fast builds
- **Tailwind CSS** + Headless UI for styling
- **Clerk** for authentication
- **Zustand** for state management
- **React Router** for routing
- **Axios** for API calls
- **Tiptap** for rich text editing

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── auth/        # Authentication components
│   ├── layout/      # Layout components (Header, Sidebar)
│   ├── ui/          # UI components (Button, Input, etc.)
│   └── error/       # Error boundary
├── pages/           # Page components
│   ├── companies/   # Company pages
│   ├── followups/   # Follow-up pages
│   └── public/      # Public viewer
├── store/           # Zustand stores
├── lib/             # Utilities and services
├── styles/          # Global styles
└── test/            # Test setup
```

## Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report

## Environment Variables

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001
VITE_ENV=development
```

## Development

The frontend connects to the backend API at `http://localhost:3001` (configured in vite.config.ts proxy).

Make sure the backend is running before starting the frontend:

```bash
cd ../backend
npm run dev
```

## Development Status

**MVP Progress: 67% Complete (4/6 phases)**

---

## MVP Phases

### Phase 1: Setup & Authentication ✅
- ✅ Vite project initialization
- ✅ Tailwind CSS & Headless UI setup
- ✅ Clerk authentication integration
- ✅ React Router configuration (10 routes)
- ✅ Layout & navigation shell (Header + Sidebar)
- ✅ Error boundary & global error handling

### Phase 2: State Management & API ✅
- ✅ Axios HTTP client with auth interceptors
- ✅ API service layer (45+ endpoints)
- ✅ Zustand stores (Auth, Companies, Contacts, FollowUps)
- ✅ Shared types integration (@meeting-followup/shared)
- ✅ Error handling & retry logic (exponential backoff)

### Phase 3: Companies & Contacts CRUD ✅
- ✅ Companies list page (search, pagination, card layout)
- ✅ Company create/edit form with validation (Zod + React Hook Form)
- ✅ Company detail page (tabs: Info, Contacts)
- ✅ Contacts list in company detail (table view)
- ✅ Contact create/edit form with validation
- ✅ Dashboard with stats, recent items, quick actions
- ✅ Modal components for forms
- ✅ Empty states and loading states

### Phase 4: Follow-up Editor & Publishing ✅
- ✅ Follow-ups list page with status filters
- ✅ Follow-up card component
- ✅ Rich text editor (Tiptap) integration
- ✅ Next steps management
- ✅ Publish/unpublish workflow with custom slugs
- ✅ Follow-up detail/preview page

### Phase 5: Public Viewer (Not Started) 🎯 **MVP CRITICAL**
- Public follow-up page at `/f/{slug}` (no auth required)
- Display meeting details, recap, and next steps
- Responsive mobile design
- Company branding display
- Print-friendly layout

### Phase 6: Deployment & Production (Not Started) 🎯 **MVP CRITICAL**
- Connect to GitHub repository
- Setup CI/CD pipeline (GitHub Actions)
- Deploy to production (Vercel recommended)
- Configure custom domain
- Setup environment variables
- SSL certificate configuration
- Basic performance monitoring

---

## Post-MVP Enhancements

### Content Library
- Reusable content blocks (About Us, Value Props, Case Studies)
- Insert library content into follow-ups
- Content override functionality

### Templates
- Pre-built follow-up templates by meeting type
- Template preview and customization
- Apply template to new follow-ups

### File Uploads
- Attach documents to follow-ups (PDFs, presentations)
- Drag & drop file upload
- File list and download functionality

### Analytics Dashboard
- Track follow-up views and engagement
- Device/browser breakdowns
- Geographic data visualization
- Export analytics reports

### Advanced Testing & Quality
- Component tests (>80% coverage)
- Integration tests
- E2E tests with Playwright/Cypress
- Performance optimization
- Accessibility audit (WCAG 2.2 AA)
