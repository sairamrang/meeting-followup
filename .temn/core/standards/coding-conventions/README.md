# Coding Conventions

This directory contains language-specific coding standards for all Temenos projects.

---

## Available Standards

### TypeScript
**File:** [typescript-coding-standards.md](typescript-coding-standards.md)
**For:** Web applications, Node.js services, Lit components
**Key Topics:** Type safety, async/await, classes, interfaces, generics

### Java
**File:** [java-coding-standards.md](java-coding-standards.md)
**For:** Backend services, Spring Boot applications, APIs
**Key Topics:** Type safety, dependency injection, exception handling, Spring Boot

### Coming Soon
- **Python** - Backend services, data processing, ML/AI
- **C#** - .NET applications, desktop apps
- **Go** - Microservices, CLI tools
- **Kotlin** - Android apps, backend services
- **Swift** - iOS/macOS applications

---

## How to Use

### For Developers
1. **Find your language:** Select the standard for your project's primary language
2. **Read thoroughly:** Understand naming conventions, code organization, best practices
3. **Apply standards:** Follow standards in all new code
4. **Refactor gradually:** Update existing code during modifications
5. **Use automation:** Configure linters and formatters based on standards

### For Code Reviewers
1. **Reference standards:** Check code against language-specific standards
2. **Be consistent:** Apply standards uniformly across all PRs
3. **Provide examples:** Link to standard examples when giving feedback
4. **Automate:** Use linters to catch common issues automatically

### For Claude Code Agents
Commands automatically read relevant language standards based on `project-context.md`:

```markdown
# Example: Commands for TypeScript project will read:
Read @.temn/standards/coding-conventions/typescript-coding-standards.md
Read @.temn/tech-stacks/web-apps/uux-lit-ts.md
```

**Selective Reading:** Only relevant language conventions are read (not all languages).

---

## Standard Structure

Each language standard follows this structure:

1. **Configuration:** Compiler/interpreter settings
2. **File Organization:** Directory structure, file naming
3. **Naming Conventions:** Variables, functions, classes, constants
4. **Type System:** Type annotations, generics, null handling
5. **Functions/Methods:** Parameters, return types, best practices
6. **Classes/Interfaces:** Structure, inheritance, composition
7. **Error Handling:** Exceptions, try-catch, custom errors
8. **Collections:** Lists, sets, maps, streams
9. **Testing:** Test naming, structure, patterns
10. **Framework-Specific:** Spring Boot, React, etc.
11. **Code Style:** Formatting, comments, documentation
12. **Best Practices:** Immutability, composition, performance
13. **Verification Checklist:** Pre-commit checklist

---

## Adding New Language Standards

### Process
1. **Create new file:** `{language}-coding-standards.md`
2. **Follow template:** Use existing standards as template
3. **Get review:** Review by language guild or tech lead
4. **Update README:** Add to "Available Standards" section
5. **Announce:** Notify teams via Slack/email

### Template Sections
- Purpose and scope
- Language version requirements
- Project structure
- Naming conventions
- Type system (if applicable)
- Functions and methods
- Classes and interfaces
- Error handling
- Testing standards
- Framework-specific guidelines
- Code style and formatting
- Best practices
- Verification checklist
- Related documents

---

## Enforcement

### Automated (Preferred)
- **Linters:** ESLint (TypeScript/JavaScript), Checkstyle (Java), Pylint (Python)
- **Formatters:** Prettier (TypeScript), Spotless (Java), Black (Python)
- **Pre-commit Hooks:** Husky + lint-staged (Git)
- **CI/CD:** Fail builds on linter errors

### Manual
- **Code Reviews:** Reviewers check compliance
- **PR Templates:** Include coding standards checklist
- **Regular Audits:** Periodic code quality audits

---

## Language-Specific Tools

### TypeScript
- **Linter:** ESLint + @typescript-eslint
- **Formatter:** Prettier
- **Type Checker:** tsc --noEmit
- **Config:** `.eslintrc.js`, `.prettierrc`, `tsconfig.json`

### Java
- **Linter:** Checkstyle, SpotBugs, PMD
- **Formatter:** Spotless, Google Java Format
- **Static Analysis:** SonarQube
- **Config:** `checkstyle.xml`, `spotless.gradle`, `pom.xml`

### Python (Coming Soon)
- **Linter:** Pylint, Flake8, Mypy (type checking)
- **Formatter:** Black, isort
- **Config:** `.pylintrc`, `pyproject.toml`

---

## Exceptions

If a project cannot follow these standards:

1. **Document in project-context.md:**
   ```markdown
   ## Coding Convention Exceptions
   - **Exception:** Using `any` types in legacy integration code
   - **Reason:** Third-party library lacks type definitions
   - **Mitigation:** Isolated to adapter layer, tests cover behavior
   - **Timeline:** Remove by Q3 2025 when library updates
   ```

2. **Get approval:** Tech Lead or Architect approval required
3. **Set remediation plan:** If temporary, define timeline to fix

---

## Updates and Versioning

### Versioning
Standards use semantic versioning:
- **Major (1.0.0 → 2.0.0):** Breaking changes requiring code updates
- **Minor (1.0.0 → 1.1.0):** New guidelines, no breaking changes
- **Patch (1.0.0 → 1.0.1):** Clarifications, typo fixes

### Update Process
1. **Propose change:** Create PR with rationale
2. **Review:** Language guild reviews and approves
3. **Announce:** Notify teams 2 weeks before enforcement
4. **Grace period:** 30 days for existing code to comply
5. **Enforce:** Enable linter rules after grace period

---

## Related Documents

- [Quality Standards](../quality-standards.md) - Cross-language quality requirements
- [Security Standards](../security-standards.md) - Secure coding practices
- [Workflow Standards](../workflow-standards.md) - Git workflow and CI/CD
- [Tech Stacks](../../tech-stacks/) - Product-specific technology configurations

---

## Questions?

- **Slack:** #coding-standards channel
- **Email:** developer-experience@temenos.com
- **Office Hours:** Fridays 2-3 PM (virtual)

---

**Last Updated:** 2025-01-11
**Maintained By:** Temenos Developer Experience Team
