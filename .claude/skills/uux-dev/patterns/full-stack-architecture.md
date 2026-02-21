# Full-Stack Architecture

## Vertical Slice Architecture

This app uses a tightly-coupled vertical slice architecture where each feature contains all layers from backend to UI:

```
Feature: Savings Goals
├── Backend Layer
│   ├── shared/types/savings-goals.types.ts (TypeScript interfaces)
│   ├── backend/fixtures/savings-goals.json (Sample data)
│   ├── backend/src/services/savings-goal.service.ts (Business logic)
│   └── backend/src/routes/savings-goals.routes.ts (REST endpoints)
├── Frontend State Layer
│   ├── frontend/src/services/savings-goal.service.ts (API client)
│   └── frontend/src/contexts/data-context.ts (State management)
└── Frontend UI Layer
    └── frontend/src/components/savings-goals/*.ts (Lit components)
```

---

## Data Flow

```
UI Component (@consume DataContext)
  ↓ calls refresh method
DataContext (cache + request deduplication)
  ↓ calls API service
Frontend API Service (openapi-fetch)
  ↓ HTTP GET/POST/PUT/DELETE
Backend Express Routes
  ↓ calls business logic
Backend Service (validation + business rules)
  ↓ calls adapter
Data Adapter (createAdapter<T>())
  ↓ reads/writes
JSON Fixtures (file storage)
```

---

## Key Architectural Decisions

### 1. No localStorage
**CRITICAL:** All data flows through the backend API. Never use localStorage for data persistence.

- Ensures data consistency
- Enables server-side validation
- Supports multi-device sync
- Maintains single source of truth

### 2. Shared Types
TypeScript interfaces are defined once in `shared/types/` and imported by both backend and frontend.

- Ensures type safety across the stack
- Single definition, no drift
- API contracts enforced at compile time

### 3. DataContext for State
All frontend state management flows through DataContext:

- 5-minute cache TTL
- Request deduplication
- Loading/error states per entity
- Performance monitoring built-in

### 4. Adapter Pattern
Backend services use `createAdapter<T>()` for data persistence:

- Abstracts storage implementation
- Easy to swap JSON fixtures for database
- Consistent CRUD interface

---

## File Naming Conventions

| Layer | Pattern | Example |
|-------|---------|---------|
| Shared Types | `{feature}.types.ts` | `savings-goals.types.ts` |
| Fixtures | `{feature}.json` | `savings-goals.json` |
| Backend Service | `{feature}.service.ts` | `savings-goal.service.ts` |
| Backend Routes | `{feature}.routes.ts` | `savings-goals.routes.ts` |
| Frontend Service | `{feature}-service.ts` | `savings-goal-service.ts` |
| UI Components | `{feature}/` directory | `savings-goals/` |

---

## Creating a New Feature

1. **Start with shared types** - Define the data model
2. **Create fixtures** - Sample data for development
3. **Implement backend service** - Business logic and validation
4. **Create routes** - REST endpoints with Swagger docs
5. **Register routes** - Add to `server.ts`
6. **Create frontend service** - API client with openapi-fetch
7. **Update DataContext** - Add entity to state management
8. **Create UI components** - Lit components consuming DataContext
