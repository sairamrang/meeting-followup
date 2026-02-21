# Key Principles

Core principles for full-stack UUX development.

---

## Backend Principles

- **Adapter pattern** - Use `createAdapter<T>()` for data persistence
- **TypeScript everywhere** - Strict typing on backend
- **Validation first** - Validate all inputs before processing
- **Business rules** - Encapsulate logic in services
- **RESTful APIs** - Follow HTTP conventions
- **Error handling** - Use ApiError with proper codes
- **ISO dates** - Use date strings for JSON serialization

---

## State Management Principles

- **DataContext integration** - Always integrate with state management
- **No localStorage** - All data flows through backend API
- **Cache strategy** - 5-minute TTL with request deduplication
- **Loading states** - Track loading/error for each entity
- **Performance monitoring** - Track API calls and cache hits

---

## Frontend UI Principles

- **UWC components only** - Never recreate what exists
- **TypeScript everywhere** - Proper interfaces and typing
- **Design tokens** - No hard-coded values
- **Accessibility** - ARIA labels, keyboard nav
- **Events** - CustomEvent with proper detail typing
- **Comments** - JSDoc for public API
- **Patterns** - Follow existing component patterns
- **@consume DataContext** - Components consume state, don't manage it

---

## Universal Principles

- **Vertical slices** - Complete features from backend to UI
- **Type safety** - Shared types between layers
- **Production-ready** - Complete, runnable code
- **Pattern following** - Learn from existing examples
- **No hacks** - Proper solutions, not workarounds
- **No over-engineering** - Simple, focused implementations
- **Accessibility first** - WCAG 2.2 AA compliance
