# Workflow Standards

**Owner:** Temenos Developer Experience Team
**Version:** 1.0
**Last Updated:** 2025-01-11

---

## Purpose

This document defines workflow standards for feature development, git branching, commit conventions, and CI/CD practices across all Temenos projects.

---

## Feature Development Workflow

### Standard Workflow (Most Common)
```
1. /temn-requirements → Specification
2. /temn-dev → Implementation
3. /temn-test → Test generation
4. /temn-verify → Requirements validation
5. /temn-pr → Pull request
6. Merge → /temn-release-notes → Deploy
```

**Use when:** Clear feature with straightforward implementation

### Systematic Workflow (Complex Features)
```
1. /temn-requirements → Specification
2. /temn-plan → Detailed task breakdown
3. Follow plan checkboxes → Implementation
4. /temn-verify → Requirements validation
5. /temn-pr → Pull request
6. Merge → /temn-release-notes → Deploy
```

**Use when:** Complex feature needing systematic breakdown with checkpoints

### Minimal Workflow (Simple Features)
```
1. /temn-dev → Implementation
2. /temn-test → Test generation
3. /temn-verify → Requirements validation
4. /temn-pr → Pull request
5. Merge → /temn-release-notes → Deploy
```

**Use when:** Very simple feature with obvious requirements

---

## Git Workflow

### Branch Strategy

**Main Branches:**
- `main` (or `master`) - Production-ready code
- `develop` - Integration branch (if using Gitflow)

**Feature Branches:**
- Pattern: `feature/{short-description}` or `feature/{ticket-id}-{description}`
- Examples: `feature/recurring-payments`, `feature/JIRA-1234-user-dashboard`
- Create from: `main` (or `develop` if using Gitflow)
- Merge into: `main` (or `develop`)

**Hotfix Branches:**
- Pattern: `hotfix/{description}`
- Example: `hotfix/login-csrf-vulnerability`
- Create from: `main`
- Merge into: `main` and `develop`

**Release Branches:**
- Pattern: `release/{version}`
- Example: `release/v2.5.0`
- Create from: `develop`
- Merge into: `main` and `develop`

### Branch Lifecycle
1. **Create branch:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/my-feature
   ```

2. **Regular commits:**
   ```bash
   git add .
   git commit -m "feat: add user profile component"
   git push origin feature/my-feature
   ```

3. **Keep updated:**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/my-feature
   git rebase main  # or merge main
   ```

4. **Create PR:**
   - Use `/temn-pr` command or GitHub UI
   - Request review from team members
   - Address feedback

5. **Merge:**
   - Squash commits (if many small commits)
   - Use merge commit (if preserving history)
   - Delete branch after merge

---

## Commit Conventions

### Conventional Commits Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no logic change)
- **refactor:** Code refactoring (no feature change)
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **build:** Build system or dependency changes
- **ci:** CI/CD configuration changes
- **chore:** Other changes (tooling, config)
- **revert:** Revert previous commit

### Examples
```bash
# Feature
git commit -m "feat: add recurring payment scheduling"

# Bug fix
git commit -m "fix: resolve race condition in account sync"

# With scope
git commit -m "feat(auth): add MFA support for admin users"

# Breaking change
git commit -m "feat!: change API response format

BREAKING CHANGE: API now returns ISO 8601 dates instead of Unix timestamps"

# Multiple paragraphs
git commit -m "fix: prevent duplicate transaction submissions

Added idempotency key to transaction API. Duplicate submissions
within 5 minutes return cached response.

Fixes #123"
```

### Commit Best Practices
- **One logical change per commit:** Each commit should represent one logical unit of work
- **Descriptive subject:** 50-72 characters, imperative mood ("add" not "added")
- **Detailed body (optional):** Explain "why" not "what" (code shows "what")
- **Reference issues:** Include ticket/issue numbers in footer
- **Atomic commits:** Should build and pass tests
- **No WIP commits:** Squash before merge (or use `git commit --amend`)

---

## Pull Request Standards

### PR Title
Follow conventional commit format:
```
feat: add recurring payment scheduling
fix(auth): resolve session timeout issue
```

### PR Description Template
```markdown
## Summary
Brief description of what this PR does

## Type of Change
- [ ] Feature (new functionality)
- [ ] Bug fix (resolves existing issue)
- [ ] Refactoring (no functional change)
- [ ] Documentation
- [ ] Breaking change

## Test Plan
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Quality Checklist
- [ ] Code follows style guide
- [ ] All tests passing
- [ ] Test coverage >80%
- [ ] No linting errors
- [ ] Documentation updated
- [ ] No security vulnerabilities

## Screenshots (if UI change)
[Attach before/after screenshots]

## Related Issues
Closes #123
Relates to #456
```

### PR Size Guidelines
- **Small:** < 100 lines changed (ideal)
- **Medium:** 100-500 lines changed (acceptable)
- **Large:** 500-1000 lines changed (requires justification)
- **Too Large:** > 1000 lines changed (break into smaller PRs)

**Exception:** Generated code, test fixtures, migrations, or config files

### Code Review Process
1. **Author self-review:** Review your own diff before requesting review
2. **Automated checks:** Ensure CI/CD passes (tests, linting, security)
3. **Peer review:** Minimum 1 approval required, 2 for critical changes
4. **Address feedback:** Respond to all comments, push changes
5. **Re-review:** Request re-review after significant changes
6. **Merge:** Merge after all checks pass and approvals obtained

---

## CI/CD Standards

### Continuous Integration (CI)

**On Pull Request:**
- [ ] Lint code (ESLint, Checkstyle, etc.)
- [ ] Type check (TypeScript, Mypy, etc.)
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Check test coverage (>80%)
- [ ] Security scan (dependencies, SAST)
- [ ] Build application
- [ ] Run E2E tests (on review approval)

**On Main Branch:**
- All PR checks +
- [ ] Deploy to staging environment
- [ ] Run smoke tests on staging
- [ ] Generate release notes (if tagged)
- [ ] Deploy to production (if approved)

### Build Standards
- **Fast Builds:** < 10 minutes for full CI pipeline
- **Cacheable:** Use dependency caching (npm, Maven, etc.)
- **Reproducible:** Same commit produces same build
- **Isolated:** No external dependencies that can break builds

### Test Execution
- **Fail Fast:** Stop on first failure for quick feedback
- **Parallel Execution:** Run tests in parallel when possible
- **Flaky Tests:** Fix or quarantine (don't ignore)
- **Test Artifacts:** Save logs, screenshots, videos for failures

---

## Release Management

### Versioning (Semantic Versioning)
```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (v1.0.0 → v2.0.0)
MINOR: New features (backward compatible) (v1.0.0 → v1.1.0)
PATCH: Bug fixes (backward compatible) (v1.0.0 → v1.0.1)
```

**Pre-release versions:**
- `v1.0.0-alpha.1` - Early testing
- `v1.0.0-beta.1` - Feature complete, testing
- `v1.0.0-rc.1` - Release candidate

### Release Process
1. **Create release branch:**
   ```bash
   git checkout develop
   git checkout -b release/v2.5.0
   ```

2. **Update version:**
   - package.json, pom.xml, etc.
   - Update changelog

3. **Final testing:**
   - Run full test suite
   - Manual QA on staging
   - Performance testing
   - Security scan

4. **Create release tag:**
   ```bash
   git checkout main
   git merge release/v2.5.0
   git tag -a v2.5.0 -m "Release v2.5.0"
   git push origin main --tags
   ```

5. **Generate release notes:**
   ```bash
   /temn-release-notes
   ```

6. **Deploy to production:**
   - Automated deployment via CI/CD
   - Or manual deployment following runbook

7. **Post-release:**
   - Monitor logs and metrics
   - Merge release branch to develop
   - Delete release branch

### Hotfix Process
1. **Create hotfix branch from main:**
   ```bash
   git checkout main
   git checkout -b hotfix/security-fix
   ```

2. **Fix issue + tests:**
   - Minimal code change
   - Add regression test

3. **Fast-track review:**
   - Expedited PR review
   - Skip some manual testing if safe

4. **Deploy immediately:**
   - Merge to main
   - Tag new patch version
   - Deploy to production
   - Backport to develop

---

## Specification Management

### Specification Directory Structure
```
.temn/specs/
├── 00-base-{product-name}/        # Base product definition
│   └── spec-base-{product}.md
├── 01-feature-name/               # Individual features
│   ├── spec-{feature}.md          # Requirements
│   ├── architecture-{feature}.md  # Architecture (optional)
│   ├── plan-{feature}.md          # Plan (optional)
│   └── _artifacts/                # Reviews, diagrams, reports
│       ├── verification-*.md
│       ├── architecture-review-*.md
│       └── design-review-*.md
```

### Specification Naming
- **Base spec:** `00-base-{product-name}`
- **Features:** `{XX}-{feature-name}` (01, 02, 03, ...)
- **Sequential numbering:** Use next available number

### Specification Lifecycle
1. **Create:** `/temn-requirements {description}`
2. **Review:** Team reviews spec for completeness
3. **Approve:** Tech Lead approves spec
4. **Implement:** Follow standard/systematic workflow
5. **Verify:** `/temn-verify` against spec
6. **Archive:** Keep spec as documentation (never delete)

### Specification Updates
- Update spec if requirements change during implementation
- Document changes in spec (add "Updates" section)
- Re-verify after spec changes

---

## Code Hygiene

### Before Committing
- [ ] Remove debug logs
- [ ] Remove commented code (or explain with ticket)
- [ ] Remove unused imports
- [ ] Format code (Prettier, Black, etc.)
- [ ] Run linter and fix issues
- [ ] Run tests locally
- [ ] Self-review diff

### Pre-Commit Hooks (Recommended)
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{js,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### Git Ignore
Always ignore:
- `node_modules/`, `target/`, `build/`, `dist/`
- `.env`, `.env.local` (never commit secrets)
- IDE files (`.idea/`, `.vscode/`, `*.iml`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Log files (`*.log`)
- Test coverage reports (`coverage/`)

---

## Collaboration Standards

### Communication
- **PR Comments:** Specific, actionable, respectful
- **Code Reviews:** Focus on code, not person
- **Blockers:** Escalate blockers immediately
- **Questions:** Ask questions in PR comments or team chat

### Review Etiquette
**As Author:**
- Respond to all comments
- Don't take feedback personally
- Explain reasoning if disagreeing
- Thank reviewers

**As Reviewer:**
- Be timely (review within 24 hours)
- Be specific (point to code, suggest alternatives)
- Distinguish between "must fix" and "nice to have"
- Approve when satisfied (don't nitpick)

### Conflict Resolution
- Discuss in comments first
- Escalate to team meeting if needed
- Tech Lead or Architect makes final call
- Document decision in PR or ADR

---

## Verification Checklist

Use this checklist before merging:

- [ ] Feature branch created from latest main
- [ ] Commits follow conventional commit format
- [ ] PR description filled out completely
- [ ] All CI/CD checks passing (tests, lint, security)
- [ ] Test coverage >80%
- [ ] Code reviewed and approved (minimum 1 approval)
- [ ] All review comments addressed
- [ ] Documentation updated (README, API docs, etc.)
- [ ] Specification verified (if applicable)
- [ ] No merge conflicts with main
- [ ] Feature branch up to date with main

---

## Related Documents

- [Quality Standards](quality-standards.md) - Code quality and testing
- [Security Standards](security-standards.md) - Secure development practices
- [Coding Conventions](coding-conventions/) - Language-specific coding standards
- [WORKFLOW.md](../WORKFLOW.md) - Detailed workflow guide with examples

---

## Tools & Automation

### Recommended Tools
- **Git:** Version control
- **GitHub/GitLab/Bitbucket:** Code hosting and PR management
- **Husky:** Git hooks
- **lint-staged:** Run linters on staged files
- **Conventional Commits CLI:** Assist with commit messages
- **GitHub Actions/GitLab CI/Jenkins:** CI/CD automation

### Command Aliases (Optional)
```bash
# .gitconfig
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

---

**Note:** These are minimum standards. Individual teams may have additional workflow requirements based on project needs.
