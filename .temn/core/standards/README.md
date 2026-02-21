# Temenos Development Standards

This directory contains universal and language-specific development standards for all Temenos projects.

---

## Purpose

Development standards ensure:
- **Consistency:** Code looks the same across teams
- **Quality:** High standards for reliability and maintainability
- **Security:** Protection against common vulnerabilities
- **Accessibility:** Products usable by all users
- **Efficiency:** Smooth workflows and clear processes

---

## Directory Structure

```
standards/
├── README.md                       # This file
├── quality-standards.md            # Test coverage, code quality, performance
├── security-standards.md           # OWASP Top 10, authentication, data protection
├── accessibility-standards.md      # WCAG 2.2 AA compliance, inclusive design
├── workflow-standards.md           # Git workflow, branching, CI/CD
└── coding-conventions/             # Language-specific coding standards
    ├── README.md
    ├── typescript-coding-standards.md
    ├── java-coding-standards.md
    ├── python-coding-standards.md    # Coming soon
    └── ...
```

---

## Universal Standards (Apply to All Projects)

### 1. Quality Standards
**File:** [quality-standards.md](quality-standards.md)

**Key Requirements:**
- Test coverage >80%
- Zero tolerance for `any` types, dead code, hardcoded secrets
- Performance targets (web: <3s load, APIs: <500ms response)
- Browser/platform support
- Code review standards

**Use when:**
- Writing any code
- Reviewing pull requests
- Setting up CI/CD pipelines

### 2. Security Standards
**File:** [security-standards.md](security-standards.md)

**Key Requirements:**
- OWASP Top 10 protection
- Password requirements (min 12 chars, MFA available)
- Authentication (OAuth 2.0, JWT)
- Data protection (PII encryption, PCI-DSS compliance)
- Secrets management

**Use when:**
- Handling user data
- Implementing authentication
- Storing sensitive information
- Conducting security reviews

### 3. Accessibility Standards
**File:** [accessibility-standards.md](accessibility-standards.md)

**Key Requirements:**
- WCAG 2.2 Level AA compliance
- Keyboard navigation for all functionality
- Color contrast 4.5:1 (text), 3:1 (UI components)
- Screen reader compatibility
- 24x24px minimum touch targets

**Use when:**
- Building user interfaces
- Implementing forms
- Adding interactive elements
- Testing with assistive technologies

### 4. Workflow Standards
**File:** [workflow-standards.md](workflow-standards.md)

**Key Requirements:**
- Feature branch workflow (`feature/{name}`)
- Conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- PR size <500 lines (preferred)
- Minimum 1 approval before merge
- CI/CD checks must pass

**Use when:**
- Creating branches
- Writing commit messages
- Creating pull requests
- Setting up CI/CD

---

## Language-Specific Standards

### Coding Conventions
**Directory:** [coding-conventions/](coding-conventions/)

**Available:**
- [TypeScript](coding-conventions/typescript-coding-standards.md) - Web apps, Node.js services
- [Java](coding-conventions/java-coding-standards.md) - Backend APIs, Spring Boot

**Coming Soon:**
- Python - Backend services, data processing
- C# - .NET applications
- Go - Microservices, CLI tools
- Kotlin - Android apps
- Swift - iOS apps

**Key Topics:**
- File naming and organization
- Naming conventions (variables, classes, constants)
- Type systems and null handling
- Functions, classes, interfaces
- Error handling
- Testing patterns
- Best practices

---

## How to Use Standards

### For Developers

#### 1. Read Relevant Standards
```markdown
# For a TypeScript web project, read:
- quality-standards.md        (universal)
- security-standards.md        (universal)
- accessibility-standards.md   (if UI)
- workflow-standards.md        (universal)
- coding-conventions/typescript-coding-standards.md
```

#### 2. Apply During Development
- Follow naming conventions
- Implement security best practices
- Ensure accessibility compliance
- Write tests for >80% coverage

#### 3. Verify Before Committing
Use verification checklists in each standard:
- [ ] Tests passing
- [ ] Coverage >80%
- [ ] No linting errors
- [ ] Accessibility tested
- [ ] Security scan clean

#### 4. Automate Enforcement
```bash
# Set up pre-commit hooks
npm install husky lint-staged --save-dev

# .husky/pre-commit
npm run lint
npm run type-check
npm test
```

### For Code Reviewers

#### 1. Use Standards as Reference
Link to specific standards in PR comments:
```markdown
Please follow TypeScript naming conventions for constants:
https://github.com/temenos/standards/coding-conventions/typescript-coding-standards.md#constants
```

#### 2. Check Verification Checklists
Ensure all checklist items are met before approval

#### 3. Provide Constructive Feedback
- Be specific (link to standard)
- Explain why (security, maintainability, etc.)
- Suggest alternatives

### For Claude Code Agents

Commands automatically read relevant standards based on `project-context.md`:

```markdown
# Example: TypeScript web project
Read @.temn/core/standards/quality-standards.md
Read @.temn/core/standards/security-standards.md
Read @.temn/core/standards/accessibility-standards.md
Read @.temn/core/standards/coding-conventions/typescript-coding-standards.md
Read @.temn/core/tech-stacks/web-apps/uux-lit-ts.md
```

**Selective Reading:** Only relevant language conventions and project tech stack are read.

---

## Standards Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ Universal Standards (All Projects)                       │
│ - quality-standards.md                                   │
│ - security-standards.md                                  │
│ - accessibility-standards.md (if UI)                     │
│ - workflow-standards.md                                  │
└─────────────────────────────────────────────────────────┘
                         ↓ applies to
┌─────────────────────────────────────────────────────────┐
│ Language-Specific Standards                              │
│ - coding-conventions/typescript-coding-standards.md      │
│ - coding-conventions/java-coding-standards.md            │
└─────────────────────────────────────────────────────────┘
                         ↓ applied in
┌─────────────────────────────────────────────────────────┐
│ Tech Stack Configuration                                 │
│ - tech-stacks/web-apps/uux-lit-ts.md                    │
│ - tech-stacks/backend-apis/java-spring.md               │
└─────────────────────────────────────────────────────────┘
                         ↓ used in
┌─────────────────────────────────────────────────────────┐
│ Project Implementation                                   │
│ - project-context.md (references tech stack)             │
│ - source code follows all standards                      │
└─────────────────────────────────────────────────────────┘
```

---

## Standards vs Tech Stacks

### Standards (This Directory)
**Scope:** Universal requirements and language-specific conventions
**Contains:**
- Quality requirements (testing, coverage, performance)
- Security requirements (OWASP, authentication, encryption)
- Accessibility requirements (WCAG 2.2 AA)
- Workflow requirements (Git, branching, CI/CD)
- Coding conventions (naming, types, patterns)

**Example:** "All APIs must respond in <500ms (P95)" (universal)

### Tech Stacks (../tech-stacks/)
**Scope:** Product-specific technology configurations
**Contains:**
- Framework versions (React 18, Spring Boot 3)
- Project structure (directories, file organization)
- Component libraries (UUX, Material-UI)
- Architecture patterns (Context API, Repository pattern)
- Development tools (Vite, Maven, Docker)

**Example:** "Use Lit 3.x + UUX web components + Vite" (product-specific)

### Relationship
```
Standards = WHAT to do
Tech Stacks = HOW to do it (for a specific product type)

Example:
Standard: "Test coverage must be >80%"
Tech Stack: "Use Web Test Runner + @open-wc/testing for Lit components"
```

---

## Enforcement

### Automated (Preferred)

#### Linting
```bash
# TypeScript
npx eslint src/**/*.ts

# Java
mvn checkstyle:check
```

#### Type Checking
```bash
# TypeScript
npx tsc --noEmit

# Java
mvn compile
```

#### Testing
```bash
# Coverage threshold
npm test -- --coverage --coverageThreshold='{"global":{"lines":80}}'
```

#### Security Scanning
```bash
# Dependencies
npm audit
mvn dependency-check:check

# Code
npm run security-scan
```

#### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  }
}
```

### Manual

#### Code Reviews
- Use PR template with standards checklist
- Reviewers verify compliance
- Link to relevant standards in comments

#### Regular Audits
- Quarterly code quality audits
- Annual security audits
- Accessibility audits before releases

---

## Exceptions Process

If a project cannot meet standards:

### 1. Document Exception
Add to `project-context.md`:
```markdown
## Standards Exceptions

### Exception: Using `any` types in legacy adapter
- **Standard:** typescript-coding-standards.md (No `any` types)
- **Reason:** Third-party library lacks type definitions
- **Mitigation:** Isolated to adapter layer, comprehensive tests
- **Approval:** Tech Lead (John Doe, 2025-01-15)
- **Remediation:** Replace library by Q3 2025
```

### 2. Get Approval
- **Minor exceptions:** Tech Lead approval
- **Major exceptions:** Architect + Security approval
- **Security exceptions:** CISO approval required

### 3. Set Remediation Plan
- Define timeline to comply
- Assign owner
- Track in backlog

---

## Updates and Versioning

### Versioning
Standards use semantic versioning:
- **Major (1.0.0 → 2.0.0):** Breaking changes requiring code updates
- **Minor (1.0.0 → 1.1.0):** New guidelines, no breaking changes
- **Patch (1.0.0 → 1.0.1):** Clarifications, typo fixes

### Update Process
1. **Propose change:** Create PR with rationale
2. **Review:** DevEx team + relevant guild
3. **Impact assessment:** Estimate impact on existing code
4. **Announce:** Notify teams 2-4 weeks before enforcement
5. **Grace period:** 30-90 days for compliance
6. **Enforce:** Enable automated checks after grace period

### Change Log
Maintain `CHANGELOG.md` in this directory tracking:
- Standard changes
- Rationale
- Impact
- Migration guide (if breaking)

---

## Resources

### Learning
- **Workshops:** Monthly standards workshops
- **Office Hours:** DevEx team office hours (Fridays 2-3 PM)
- **Samples:** Reference implementations in `/samples/`

### Tools
- **Linters:** ESLint, Checkstyle, Pylint
- **Formatters:** Prettier, Spotless, Black
- **Security:** Snyk, SonarQube, OWASP ZAP
- **Accessibility:** axe DevTools, Lighthouse, WAVE

### Support
- **Slack:** #development-standards
- **Email:** developer-experience@temenos.com
- **Docs:** https://docs.temenos.com/standards

---

## Quick Reference

### Pre-Development Checklist
- [ ] Read universal standards (quality, security, accessibility, workflow)
- [ ] Read language-specific coding conventions
- [ ] Read tech stack documentation
- [ ] Set up linters and formatters
- [ ] Configure pre-commit hooks

### Pre-Commit Checklist
- [ ] Code follows coding conventions
- [ ] Tests written (>80% coverage)
- [ ] Tests passing
- [ ] No linting errors
- [ ] No security vulnerabilities
- [ ] Accessibility verified (if UI)
- [ ] Documentation updated

### Pre-Merge Checklist
- [ ] All commits follow conventional commits
- [ ] PR description complete
- [ ] All CI/CD checks passing
- [ ] Code reviewed and approved
- [ ] All review comments addressed
- [ ] Verification checklist completed

---

## Related Documents

- [Tech Stacks](../tech-stacks/) - Product-specific technology configurations
- [Workflow Guide](../WORKFLOW.md) - Detailed development workflow
- [Multi-Product Guide](../docs/MULTI_PRODUCT_GUIDE.md) - Multi-product setup
- [Project Context](../../project-context.md) - Current project configuration

---

**Last Updated:** 2025-01-11
**Maintained By:** Temenos Developer Experience Team
**Version:** 1.0.0
