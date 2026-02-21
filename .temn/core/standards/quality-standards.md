# Quality Standards

**Owner:** Temenos Developer Experience Team
**Version:** 1.0
**Last Updated:** 2025-01-11

---

## Purpose

This document defines universal quality standards for all Temenos software projects, regardless of language, platform, or product type.

---

## Test Coverage

### Requirements
- **Minimum Coverage:** >80% code coverage for all production code
- **Critical Paths:** 100% coverage for critical business logic, security, and data integrity paths
- **New Code:** All new features must include tests before merge
- **Regression:** All bugs must have a test to prevent regression

### Coverage Types
- **Unit Tests:** Test individual functions/classes in isolation
- **Integration Tests:** Test component interactions and data flow
- **E2E Tests:** Test critical user journeys from UI to database
- **Contract Tests:** Test API contracts for backend services

### Exemptions
- Generated code (clearly marked)
- Trivial getters/setters (if truly trivial)
- Third-party library wrappers (wrap, don't modify)

**Verification:** Run coverage reports before merge. CONDITIONAL PASS if >80% and critical paths covered.

---

## Code Quality

### Zero Tolerance
- **No loose typing:** No `any` types (TypeScript), no Object types (Java), etc.
- **No dead code:** Remove unused imports, functions, variables
- **No commented code:** Remove or explain with ticket reference
- **No hardcoded secrets:** Use environment variables or secret management
- **No console logs:** Use proper logging frameworks (remove debug logs before merge)

### Static Analysis
- **Linting:** All code must pass linter (ESLint, Checkstyle, Pylint, etc.)
- **Formatting:** All code must be formatted consistently (Prettier, Black, gofmt, etc.)
- **Type Checking:** Strict mode enabled for TypeScript, null safety for Kotlin, etc.
- **Security Scanning:** No high/critical vulnerabilities in dependencies

### Code Review Standards
- **PR Size:** Prefer <500 lines. Break large features into smaller PRs
- **Self-Review:** Review your own diff before requesting review
- **Documentation:** Update README, API docs, and comments as needed
- **Tests Included:** All PRs include tests unless documentation-only

---

## Performance Standards

### Web Applications
- **App Load:** < 3 seconds on 3G connection
- **Time to Interactive (TTI):** < 5 seconds on 3G
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Backend APIs
- **Response Time:** P95 < 500ms for read operations, < 2s for write operations
- **Throughput:** Support concurrent users per product requirements
- **Database Queries:** N+1 queries prohibited. Use eager loading or batching.
- **Caching:** Implement caching for frequently accessed data

### Mobile Applications
- **App Startup:** < 2 seconds on mid-range devices
- **Frame Rate:** Maintain 60fps during interactions
- **Battery Usage:** Minimal background activity
- **Data Usage:** Efficient data sync (delta updates, compression)

---

## Browser/Platform Support

### Web Applications
- **Browsers:** Latest 2 versions of Chrome, Firefox, Safari, Edge
- **Mobile Browsers:** Safari iOS, Chrome Android
- **Responsive:** 320px to 2560px viewport widths
- **Progressive Enhancement:** Core functionality works without JavaScript

### Mobile Applications
- **iOS:** Latest 2 major versions (e.g., iOS 16, iOS 17)
- **Android:** API 26+ (Android 8.0+)
- **Tablets:** Support both phone and tablet form factors

### Desktop Applications
- **Windows:** Windows 10 and 11
- **macOS:** Latest 2 major versions
- **Linux:** Ubuntu LTS and Fedora latest

---

## Reliability Standards

### Error Handling
- **Graceful Degradation:** App remains functional when non-critical features fail
- **User-Friendly Messages:** No technical stack traces shown to end users
- **Logging:** All errors logged with context (user ID, request ID, timestamp)
- **Retry Logic:** Implement exponential backoff for transient failures

### Resilience
- **Timeouts:** All network calls have timeouts (5-30 seconds depending on operation)
- **Circuit Breakers:** Prevent cascading failures in distributed systems
- **Fallbacks:** Provide cached data or default responses when services unavailable
- **Health Checks:** All services expose health endpoints

### Data Integrity
- **Validation:** Input validation on both client and server
- **Transactions:** Use database transactions for multi-step operations
- **Idempotency:** Write operations are idempotent where possible
- **Audit Trails:** Log all data changes with user, timestamp, and reason

---

## Documentation Standards

### Code Documentation
- **Public APIs:** All public methods/functions documented with:
  - Purpose and behavior
  - Parameters and return values
  - Exceptions thrown
  - Usage examples for complex APIs
- **Complex Logic:** Non-obvious code explained with inline comments
- **Architecture Decisions:** Document significant decisions in ADRs (Architecture Decision Records)

### Project Documentation
- **README.md:** Setup instructions, architecture overview, testing instructions
- **API Documentation:** OpenAPI/Swagger for REST APIs, GraphQL schema for GraphQL
- **Runbooks:** Operational procedures for deployment, monitoring, troubleshooting
- **Changelog:** Maintain changelog following Keep a Changelog format

---

## Verification Checklist

Use this checklist during code review and verification:

- [ ] Test coverage >80% (run coverage report)
- [ ] All tests passing (unit, integration, E2E)
- [ ] No TypeScript `any` / Java `Object` / loose types
- [ ] Linter passing (no warnings or errors)
- [ ] Code formatted consistently
- [ ] No hardcoded secrets or credentials
- [ ] Performance benchmarks met (if applicable)
- [ ] Browser/platform support verified
- [ ] Error handling tested (negative test cases)
- [ ] Documentation updated (README, API docs, comments)
- [ ] Security scan passing (no high/critical vulnerabilities)

---

## Related Documents

- [Security Standards](security-standards.md) - Security and compliance requirements
- [Accessibility Standards](accessibility-standards.md) - WCAG compliance and inclusive design
- [Workflow Standards](workflow-standards.md) - Git workflow, branching, and CI/CD
- [Coding Conventions](coding-conventions/) - Language-specific coding standards

---

## Exceptions Process

If a project cannot meet these standards:

1. Document the exception in project-context.md
2. Provide business justification
3. Define mitigation plan or alternative approach
4. Get approval from Tech Lead or Architect
5. Set timeline for remediation (if temporary exception)

---

**Note:** These are minimum standards. Individual products may have stricter requirements based on regulatory, security, or business needs.
