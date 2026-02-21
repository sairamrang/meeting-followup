# Phase 1: Project Setup & Authentication

Spec: [Clerk auth](../frontend-app-spec-functional.md#r-001) | [Routing](../frontend-app-spec-functional.md#user-workflows) | [AC-1](../frontend-app-spec-functional.md#ac-1)

## Task 1.1: Vite Project Initialization {#task-11}

`apps/frontend/` (monorepo root)

- [ ] Remove CRA boilerplate; initialize Vite + React 18 template
- [ ] Configure `vite.config.ts`: aliases (`@/*`), React plugin, source maps
- [ ] Setup `tsconfig.json`: strict mode, module resolution, lib targets
- [ ] Install core deps: React, React Router, Zustand, Axios, Tailwind
- [ ] Create `.env.example` with VITE_CLERK_PK and VITE_API_URL placeholders
- [ ] Test: `npm run dev` runs without errors

**Maps to:** AC-1 (foundation for auth)

---

## Task 1.2: Tailwind CSS & Headless UI Setup {#task-12}

`apps/frontend/tailwind.config.js`, `apps/frontend/src/styles/`

- [ ] Install Tailwind CSS 3.4.1 and Headless UI 1.7.18
- [ ] Create base config with brand colors (primary, secondary, error, success)
- [ ] Setup global styles: `index.css` with Tailwind directives
- [ ] Create Tailwind plugin for custom utilities (e.g., `focus-ring`)
- [ ] Setup theme overrides: line-height, letter-spacing, shadow depth
- [ ] Configure dark mode (auto-detect system preference)
- [ ] Test: Build and verify CSS is bundled

**Maps to:** AC-1, AC-2, AC-3 (styling foundation)

---

## Task 1.3: Clerk Authentication Integration {#task-13}

`apps/frontend/src/lib/clerk-config.ts`, `apps/frontend/src/providers/`

- [ ] Install @clerk/clerk-react 4.30.7
- [ ] Create `clerk-config.ts`: initialize Clerk with frontend PK
- [ ] Wrap app in `<ClerkProvider>` at root
- [ ] Configure allowed redirect URIs for dev/prod environments
- [ ] Create `useAuth()` hook: expose `isLoaded`, `isSignedIn`, `user`, `signOut`
- [ ] Setup Clerk session management: auto-refresh tokens, handle expiration
- [ ] Test: Navigate to app, see Clerk sign-in/sign-up modal

**Maps to:** AC-1 (authentication entry point)

---

## Task 1.4: React Router Configuration {#task-14}

`apps/frontend/src/router.tsx`, `apps/frontend/src/pages/`

- [ ] Setup React Router 6.21.2 with BrowserRouter
- [ ] Create protected route wrapper: `<ProtectedRoute>` (redirects to sign-in if unauthorized)
- [ ] Define routes:
  - `/` → Dashboard (protected)
  - `/sign-in/*` → Clerk sign-in page (public)
  - `/sign-up/*` → Clerk sign-up page (public)
  - `/companies` → Companies list (protected)
  - `/follow-ups` → Follow-ups list (protected)
  - `/f/:slug` → Public viewer (public)
- [ ] Setup 404 page with link back to dashboard
- [ ] Configure error boundary at root level
- [ ] Test: Navigation between routes works; protected routes redirect

**Maps to:** AC-1, workflow entry points

---

## Task 1.5: Layout & Navigation Shell {#task-15}

`apps/frontend/src/components/layout/main-layout.tsx`, `apps/frontend/src/components/nav/`

- [ ] Create `MainLayout` component: header, sidebar, main content area
- [ ] Build header: logo, user menu (profile/settings/sign-out)
- [ ] Create sidebar navigation:
  - Dashboard icon link
  - Companies icon link
  - Follow-ups icon link
- [ ] Add mobile responsive menu (hamburger icon on mobile)
- [ ] Implement breadcrumb navigation component
- [ ] Add user avatar in header (from Clerk user data)
- [ ] Test: Responsive on 320px-2560px viewports

**Maps to:** AC-1, AC-2, AC-3, AC-4 (user navigation)

---

## Task 1.6: Error Boundary & Global Error Handling {#task-16}

`apps/frontend/src/components/error-boundary.tsx`, `apps/frontend/src/lib/error-handler.ts`

- [ ] Create `ErrorBoundary` component: catch React errors, display fallback UI
- [ ] Build error logger service: log to console in dev, external service in prod
- [ ] Create toast notification system for user-friendly error messages
- [ ] Setup Axios interceptor for API error responses
- [ ] Handle common HTTP errors: 401 (redirect to sign-in), 403 (forbidden), 5xx (retry)
- [ ] Test: Manually throw error in component, verify boundary catches it

**Maps to:** Quality standards (error handling)

---

## Task 1.7: Environment Configuration & Build Pipeline {#task-17}

`apps/frontend/.env*`, `apps/frontend/vite.config.ts`

- [ ] Create `.env.development`, `.env.production` with API URLs
- [ ] Configure Vite: output directory, asset handling, minification
- [ ] Setup source map generation for production debugging
- [ ] Create build optimization: CSS purging, code splitting
- [ ] Setup `build-info.json` generation (git hash, timestamp)
- [ ] Test: `npm run build` produces optimized bundle; check sizes

**Maps to:** Performance standards (<2s load time)

---

## Task 1.8: Testing Infrastructure Setup {#task-18}

`apps/frontend/vitest.config.ts`, `apps/frontend/src/test/`

- [ ] Install Vitest 1.2.0, React Testing Library 14.1.2, jsdom
- [ ] Create Vitest config: setup files, module aliases, jsdom environment
- [ ] Create test utilities: `render()` wrapper with providers, `screen`, `userEvent`
- [ ] Setup mock API client for tests
- [ ] Configure coverage thresholds (>80% overall)
- [ ] Create first smoke test: verify app renders without errors
- [ ] Test: `npm run test` runs and passes

**Maps to:** Quality standards (>80% coverage), AC-1

---

## Acceptance Criteria Checkpoints

- [x] AC-1: New user visits app → Sees Clerk sign-in/sign-up *(Task 1.3, 1.4)*
- [x] Foundation tasks complete: Vite, Tailwind, Clerk, Router, Layout, Tests

