# Output Strategy Guide

How to determine implementation scope, file generation order, and output format.

---

## Step 1: Determine Implementation Scope

Analyze requirements to determine what to generate:

```typescript
// Full-stack feature (MOST COMMON)
if (needsBackendAPI || needsDataPersistence || needsServerState) {
  generate: [
    "shared/types",
    "backend/fixtures",
    "backend/service",
    "backend/routes",
    "frontend/service",
    "dataContext integration",
    "frontend/components",
  ];
}

// Frontend-only feature (RARE - only if data is purely client-side)
else if (purelyClientSide) {
  generate: ["frontend/types", "frontend/components"];
}
```

**IMPORTANT:** Default to full-stack unless explicitly told otherwise.

---

## Step 2: File Generation Order (Full-Stack)

Generate in this order for vertical slice:

### 2.1 Backend Layer

1. `shared/types/{feature}.types.ts` - TypeScript interfaces
2. `backend/fixtures/{feature}.json` - Sample data
3. `backend/src/services/{feature}.service.ts` - Business logic
4. `backend/src/routes/{feature}.routes.ts` - REST endpoints
5. Update `backend/src/server.ts` - Register routes

### 2.2 Frontend State Layer

1. `frontend/src/services/{feature}-service.ts` - API client
2. `frontend/src/contexts/data-context.types.ts` - Add entity types
3. `frontend/src/contexts/data-context.ts` - Add refresh methods

### 2.3 Frontend UI Layer

1. `frontend/src/components/{feature}/` - Lit components
2. `frontend/src/types/{feature}.types.ts` - Re-export shared types

**All code goes to source directories - NOT to _artifacts/!**

---

## Step 3: Provide Live Updates During Implementation

Use the LIVE IMPLEMENTATION UPDATES format from [implementation-updates.md](implementation-updates.md) to communicate key decisions.

---

## Step 4: Identify Completed Plan Tasks

Before returning summary, if a plan was provided in context:

1. **Review the plan content** provided in your prompt context
2. **Identify which tasks you completed** during implementation
3. **Extract task IDs** (e.g., "1.1", "2.3", "2.6.4")
4. **List them** in your final summary

**Common task mappings:**

- Created TypeScript interfaces → Task 1.1
- Created component structure → Task 2.6.1, 2.6.2
- Implemented component properties → Task 2.6.2
- Implemented component state → Task 2.6.3
- Implemented render method → Task 2.6.4
- Created service file → Task 2.1.1
- Implemented service methods → Task 2.1.2, 2.1.3, etc.

---

## Step 5: Return Final Summary (40-80 lines max)

After live updates and writing files, return a final summary.

### Full-Stack Summary Format

```markdown
✓ Full-stack feature generated successfully

**Plan Tasks Completed:**
- Task 1.1 (Shared TypeScript interfaces)
- Task 2.1 (Backend service + routes)
- Task 2.2 (Frontend API client)
- Task 2.3 (DataContext integration)
- Task 2.6.1-2.6.4 (UI components)

**Backend Files Created:**
- [feature.types.ts](shared/types/feature.types.ts) (XXX lines)
- [feature.json](backend/fixtures/feature.json) (YY lines)
- [feature.service.ts](backend/src/services/feature.service.ts) (ZZZ lines)
- [feature.routes.ts](backend/src/routes/feature.routes.ts) (AAA lines)

**Frontend Files Created:**
- [feature-service.ts](frontend/src/services/feature-service.ts) (BBB lines)
- [data-context.types.ts](frontend/src/contexts/data-context.types.ts) (updated)
- [data-context.ts](frontend/src/contexts/data-context.ts) (updated)
- [component-name.ts](frontend/src/components/feature/component-name.ts) (CCC lines)

**Backend API:**
- X REST endpoints (GET, POST, PUT, DELETE)
- Full CRUD operations
- Validation and business rules

**State Management:**
- DataContext integration with 5-min cache
- Request deduplication
- Loading and error states

**Frontend Features:**
- Feature 1 with brief description
- Feature 2 with brief description

**UWC Components Used:**
- uwc-component-1 (purpose)
- uwc-component-2 (purpose)

**Events Dispatched:**
- event-name - Typed detail interface - When fired

**Accessibility:**
- ARIA labels on all icon buttons
- Keyboard navigation (Tab, Enter, Escape)

**Next Steps:**
1. Test backend → `cd backend && npm test`
2. Test frontend → `cd frontend && npm test`
3. Build → `npm run build:shared && npm run build`
4. Start → `cd backend && npm start` + `cd frontend && npm run dev`
```

---

## Style Guidelines for Summary

- Use ✓ (not emoji) for success status
- Use markdown links for all file references: `[file.ts](path)`
- Use **bold** for section headers only
- Use normal weight for content
- Use dash bullets (-) for all lists
- Keep component/file counts in parentheses
- No emoji decoration
- Lead with status, follow with details
- Maximum 60-80 lines total

---

## Output Rules (CRITICAL)

### DO

- Provide live updates during implementation (all layers)
- Write code to proper directories:
  - Backend → `backend/src/`, `backend/fixtures/`
  - Shared → `shared/types/`
  - Frontend → `frontend/src/`
- Generate full-stack unless explicitly told frontend-only
- Integrate with DataContext when generating backend API
- Register routes in `backend/src/server.ts`
- Identify completed plan tasks and list in summary
- Return 40-80 line final summary after live updates
- List all files created with line counts
- List API endpoints and UWC components used
- Provide next steps (testing, building)

### DON'T

- Return full code to main conversation
- Write code to `_artifacts/`
- Skip live updates
- Skip plan task identification
- Exceed 80 lines in final summary
- Use localStorage
- Skip DataContext integration
