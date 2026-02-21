# Project Context

**Generated:** 2026-01-27
**Last Updated:** 2026-01-27

---

## Project Identity

| Property | Value |
|----------|-------|
| **Name** | Meeting Follow-Up System |
| **Type** | full-stack |
| **Category** | SaaS / Sales Enablement |
| **Description** | AI-powered meeting follow-up system replacing email with trackable web pages |

---

## Technical Stack References

| Layer | Stack | Reference |
|-------|-------|-----------|
| **Frontend** | React + Vite + TypeScript | `.temn/core/tech-stacks/web-apps/react-ts.md` |
| **Backend** | Express + Prisma + PostgreSQL | `.temn/core/tech-stacks/backend-apis/express-prisma.md` |
| **Testing** | Vitest + Playwright | `.temn/core/tech-stacks/testing/vitest.md` |
| **Authentication** | Clerk | Third-party managed auth service |
| **Storage** | Supabase Storage | S3-compatible object storage |
| **Deployment** | Vercel | Serverless functions + CDN |

**Standards:** `.temn/core/standards/` (quality, security, accessibility, coding conventions)

---

## Detailed Tech Stack

### Frontend (React 18 + TypeScript)
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.11
- **Routing:** React Router 6.21.2
- **State Management:** Zustand 4.4.7
- **Forms:** React Hook Form 7.49.3 + Zod 3.22.4 validation
- **Rich Text Editor:** Tiptap 2.1.16 (extensible WYSIWYG)
- **Styling:** Tailwind CSS 3.4.1 + Headless UI 1.7.18
- **HTTP Client:** Axios 1.6.5
- **File Upload:** react-dropzone 14.2.3
- **Authentication:** @clerk/clerk-react 4.30.7
- **Testing:** Vitest 1.2.0, React Testing Library 14.1.2
- **TypeScript:** 5.3.3 (strict mode)

### Backend (Node.js 20 + Express + TypeScript)
- **Runtime:** Node.js 20+ LTS
- **Framework:** Express 4.18.2
- **Database ORM:** Prisma 5.8.1 (PostgreSQL 15+)
- **Authentication:** @clerk/clerk-sdk-node 4.13.11
- **Validation:** Zod 3.22.4 (shared with frontend)
- **File Upload:** Multer 1.4.5-lts.1
- **URL Slugification:** slugify 1.6.6
- **Security:** Helmet 7.1.0, CORS 2.8.5, Rate Limiting 7.1.5
- **Testing:** Vitest 1.2.0, Supertest 6.3.4
- **Dev Server:** tsx 4.7.0 (TypeScript execution)
- **TypeScript:** 5.3.3 (strict mode)

### Shared Packages
- **Types:** @meeting-followup/shared (TypeScript interfaces)
- **Validation Schemas:** Zod 3.22.4 (shared between frontend & backend)

### Architecture
- **Pattern:** Monorepo with npm workspaces
- **Structure:**
  - `apps/backend` - Express API
  - `apps/frontend` - React SPA
  - `packages/shared` - Shared TypeScript types
- **Code Style:** ESLint 8.56 + Prettier 3.2.4
- **File Naming:** kebab-case for files, PascalCase for React components
- **Import Style:** Relative paths, `@meeting-followup/shared` for shared package

---

## Claude Code Resources

### Project Classification

| Property | Value |
|----------|-------|
| **Stack Type** | full-stack |
| **Has UI** | true |
| **Has Backend** | true |
| **Has Design System** | false (using Tailwind + Headless UI) |

### Skills

| Skill | Path | Purpose |
|-------|------|---------|
| ux-design | `.claude/skills/ux-design/` | UX patterns, workflows, interaction design |
| docx | `.claude/skills/docx/` | Word document generation (for export features) |
| pptx | `.claude/skills/pptx/` | PowerPoint generation (for export features) |
| pdf | `.claude/skills/pdf/` | PDF generation and manipulation |
| skill-creator | `.claude/skills/skill-creator/` | Create new custom skills as needed |

### Design System

**Styling Approach:** Tailwind CSS utility-first + Headless UI components

| Resource | Path |
|----------|------|
| **Tailwind Config** | `apps/frontend/tailwind.config.js` |
| **Components** | Headless UI (accessible, unstyled components) |
| **Custom Components** | `apps/frontend/src/components/` |

### Review Categories (full-stack: 9 categories)

Component Architecture (10%), State Management (10%), Data Flow (15%), Performance (10%), Accessibility (10%), Testing (15%), Code Quality (15%), Type Safety (10%), Security (5%)

### Agents

| Command | Agent | Purpose |
|---------|-------|---------|
| `/temn:temn-architect` | temn/temn-architect-agent | Design/review technical architecture |
| `/temn:temn-plan` | temn/temn-plan-agent | Create development plans with task breakdown |
| `/temn:temn-requirements` | temn/temn-requirements-agent | Gather functional requirements |
| `/temn:temn-test` | temn/temn-test-agent | Generate comprehensive test suites (>80% coverage) |
| `/temn:temn-review` | temn/temn-review-agent | 9-category code quality review |
| `/temn:temn-verify` | temn/temn-verify-agent | Verify implementation against spec |
| `/temn:temn-debug` | temn/temn-debug-agent | Multi-angle bug analysis |

---

## Quality Standards

### Code Coverage
- **Target:** >80% overall
- **Unit Tests:** Vitest (backend + frontend)
- **Integration Tests:** Supertest (API)
- **E2E Tests:** Playwright (user flows)

### Performance Targets
- **Page Load:** <2s (P95)
- **API Response:** <500ms (P95)
- **Auto-save Latency:** <200ms
- **File Upload:** <5s for 10MB

### Accessibility
- **Standard:** WCAG 2.2 Level AA
- **Testing:** Lighthouse (≥95), axe DevTools
- **Requirements:** Semantic HTML, ARIA labels, keyboard navigation, screen reader support

### Security
- **Authentication:** Clerk managed service (JWT-based)
- **Authorization:** User-scoped data access
- **Input Validation:** Zod schemas (frontend + backend)
- **Security Headers:** Helmet, CORS, CSP
- **Rate Limiting:** 100 req/min per user
- **File Upload:** Type validation, size limits (10MB), malware scanning planned
- **Analytics Privacy:** IP hashing (SHA-256), no PII storage, 12-month retention

---

## Project-Specific Overrides

### API Design
- RESTful with resource-based URLs
- Zod validation on all endpoints
- Structured error responses with error codes
- Pagination for list endpoints

### Database Design
- 8 tables: followups, files, templates, library, analytics_events, analytics_sessions
- JSONB for flexible data (contacts, next steps, company content)
- Indexes on slug (UNIQUE), userId, followupId
- Cascade deletes for related data

### Frontend Patterns
- Zustand for global state (lightweight, less boilerplate than Redux)
- React Hook Form + Zod for forms
- Axios interceptors for auth tokens
- Tailwind utility classes + Headless UI for accessible components
- Auto-save with 30s debounce

### Testing Strategy
- Unit tests for business logic (Vitest)
- Integration tests for API endpoints (Supertest)
- E2E tests for critical user flows (Playwright)
- Component tests for UI (React Testing Library)

---

**Note:** For directory structure, conventions, and workflow, see `CLAUDE.md`. For detailed stack patterns, see referenced files above.
