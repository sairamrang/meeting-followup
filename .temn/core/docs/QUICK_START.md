# Quick Start Guide - Temenos SDLC OS

**Get started with Temenos SDLC OS in 10 minutes**

---

## What is Temenos SDLC OS?

Temenos SDLC OS is a complete Software Development Lifecycle Operating System that provides:
- **AI-Powered Commands** - From requirements to deployment
- **Multi-Product Support** - Web, mobile, backend, desktop, CLI, libraries
- **Quality-First** - Built-in verification, testing, and review
- **Design System Aware** - Integrates with Temenos UUX and other design systems

---

## Prerequisites

- **Claude Code** installed and authenticated
- **Git** repository initialized
- **Basic knowledge** of your tech stack (e.g., TypeScript, Java)

---

## 5-Minute Setup

### Step 1: Initialize Your Project (2 minutes)

```bash
# In your project root
/temn:temn-init
```

**What it does:**
- Analyzes your codebase
- Creates `.temn/project-context.md` with project configuration
- Sets up directory structure for specifications
- Detects tech stack and product type

**Output:** `.temn/project-context.md` created

### Step 2: Verify Setup (1 minute)

```bash
# Check your project context
cat .temn/project-context.md
```

**Look for:**
- Project type (web-app, backend-api, mobile-app, etc.)
- Tech stack (Lit + TypeScript, Java + Spring, etc.)
- Architecture patterns
- Quality standards

### Step 3: Start Your First Feature (2 minutes)

```bash
# Create a feature specification
/temn:temn-requirements "Add user profile management"
```

**What happens:**
- AI asks clarifying questions about the feature
- Generates detailed specification with acceptance criteria
- Creates `.temn/specs/XX-user-profile/spec-user-profile.md`
- Ready for implementation

---

## Your First Feature (End-to-End)

### Standard Workflow (5 steps)

```bash
# 1. Requirements (AI asks questions, generates spec)
/temn:temn-requirements "User login with email and password"

# 2. Implementation (AI generates full-stack code)
/temn:temn-dev

# 3. Testing (AI generates comprehensive test suite)
/temn:temn-test

# 4. Verification (AI checks against requirements)
/temn:temn-verify

# 5. Pull Request (AI creates PR with quality ratings)
/temn:temn-pr
```

**Total time:** 20-30 minutes for a complete feature with tests and verification

### Systematic Workflow (For complex features)

```bash
# 1. Requirements
/temn:temn-requirements "Multi-step payment wizard with validation"

# 2. Detailed Plan (breaks down into tasks)
/temn:temn-plan

# 3. Follow the plan checkboxes (AI guides you step-by-step)
# Work through each task systematically

# 4. Verification
/temn:temn-verify

# 5. Pull Request
/temn:temn-pr
```

---

## Essential Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/temn:temn-requirements` | Create specification | Start of every feature |
| `/temn:temn-dev` | Implement feature | After spec, generates code |
| `/temn:temn-test` | Generate tests | After implementation |
| `/temn:temn-verify` | Verify requirements | Before PR |
| `/temn:temn-pr` | Create pull request | After verification PASS |
| `/temn:temn-plan` | Detailed breakdown | Complex features only |
| `/temn:temn-review` | Code + design review | Quality audit |
| `/temn:temn-release-notes` | Generate release notes | After merge |

---

## Key Concepts

### 1. Project Context
**File:** `.temn/project-context.md`

The single source of truth for your project:
- Tech stack (frameworks, libraries, tools)
- Architecture patterns (layered, feature-based, etc.)
- Quality standards (coverage targets, performance)
- Component patterns (design system, state management)

**All commands read this file** to understand your project.

### 2. Specifications
**Location:** `.temn/specs/XX-feature-name/`

Each feature has a specification:
```
.temn/specs/
├── 00-base-app/              # Base product definition
└── 01-user-profile/          # Feature specification
    ├── spec-user-profile.md  # Requirements & acceptance criteria
    ├── plan-user-profile.md  # Development plan (optional)
    └── _artifacts/           # Reviews, diagrams, verification
```

### 3. Standards & Tech Stacks
**Location:** `.temn/standards/` and `.temn/tech-stacks/`

Commands automatically read relevant standards:
- **Universal:** Quality, security, accessibility, workflow
- **Language-specific:** TypeScript, Java, Python, etc.
- **Tech stack:** UUX Lit TypeScript, Java Spring, etc.

**You don't need to manage this** - commands read automatically based on your project context.

---

## Common Workflows

### Creating a New Feature
```bash
/temn:temn-requirements "Feature description"
# Answer AI questions
/temn:temn-dev
/temn:temn-test
/temn:temn-verify
/temn:temn-pr
```

### Enhancing Existing Feature
```bash
/temn:temn-requirements enhance .temn/specs/01-feature/spec-feature.md
# Describe enhancements
/temn:temn-dev
/temn:temn-test
/temn:temn-verify
/temn:temn-pr
```

### Fixing a Bug
```bash
# Option 1: Quick fix (no spec needed)
/temn:temn-dev "Fix login button not responding on mobile"
/temn:temn-test
/temn:temn-verify
/temn:temn-pr

# Option 2: With specification (complex bugs)
/temn:temn-requirements "Fix race condition in account sync"
/temn:temn-dev
/temn:temn-test
/temn:temn-verify
/temn:temn-pr
```

### Code Review
```bash
# Comprehensive review (code + UX/design)
/temn:temn-review

# UX/design only (from screenshots)
/temn:temn-ux-review
```

---

## Best Practices

### ✅ DO

1. **Run `/temn:temn-init` first** - Sets up project context
2. **Start with requirements** - Even for small features, creates clarity
3. **Expect CONDITIONAL PASS** - First verification usually finds issues, that's normal
4. **Fix high-priority issues** - Address CRITICAL and HIGH before merging
5. **Use systematic workflow for complex features** - Plan first, then implement
6. **Keep specs updated** - If requirements change, update the spec

### ❌ DON'T

1. **Don't skip verification** - Always run `/temn:temn-verify` before PR
2. **Don't ignore CRITICAL issues** - These must be fixed before merge
3. **Don't modify generated files manually** - Regenerate with commands instead
4. **Don't create features without specs** - Unless very trivial (<20 lines)
5. **Don't merge with FAIL status** - Fix issues and re-verify

---

## Quality Gates

### PASS ✅
- All acceptance criteria met
- Test coverage >80%
- No critical/high issues
- Accessibility compliant (if UI)
- Performance targets met

### CONDITIONAL PASS ⚠️
- Most criteria met
- Minor issues or gaps
- **Action:** Fix high-priority items, re-verify

### FAIL ❌
- Critical criteria not met
- Major functionality missing
- **Action:** Significant rework needed

**Normal flow:** CONDITIONAL PASS → Fix issues → PASS

---

## Getting Help

### Documentation
- **Full Workflow:** `.temn/WORKFLOW.md`
- **Standards:** `.temn/standards/README.md`
- **Tech Stacks:** `.temn/tech-stacks/README.md`
- **Multi-Product:** `.temn/docs/MULTI_PRODUCT_GUIDE.md`

### Interactive Tutorial
```bash
/temn:temn-tutorial
```
Walks through creating a complete feature step-by-step.

### Command Help
```bash
/temn:temn-help
```
Lists all available commands with descriptions.

---

## Example: First Feature (Complete)

Let's create a simple feature from scratch:

### 1. Create Specification
```bash
/temn:temn-requirements "Add account balance display card"
```

**AI asks:**
- Should it show current balance?
- Should it show available balance?
- Should it be real-time or cached?
- Any currency formatting requirements?
- Accessibility requirements?

**You answer, AI generates:**
`.temn/specs/01-balance-card/spec-balance-card.md`

### 2. Review Specification
```bash
cat .temn/specs/01-balance-card/spec-balance-card.md
```

**Check:**
- Acceptance criteria clear?
- Technical requirements specified?
- UX requirements included?

### 3. Implement
```bash
/temn:temn-dev
```

**AI generates:**
- Backend service (if needed)
- DataContext for state management
- UI component using UUX components
- Proper error handling
- Loading states

### 4. Generate Tests
```bash
/temn:temn-test
```

**AI generates:**
- Unit tests for service
- Unit tests for component
- E2E test for user flow
- Accessibility tests
- Coverage >80%

### 5. Verify
```bash
/temn:temn-verify
```

**AI checks:**
- All acceptance criteria
- Test coverage
- Code quality
- Accessibility
- Performance

**Result:** CONDITIONAL PASS
- ✅ 8/10 acceptance criteria met
- ⚠️ Missing error state test
- ⚠️ Currency formatting needs improvement

### 6. Fix Issues
```bash
/temn:temn-dev "Fix missing error state test and improve currency formatting"
/temn:temn-test
/temn:temn-verify
```

**Result:** PASS ✅

### 7. Create PR
```bash
/temn:temn-pr
```

**AI generates:**
- PR title and description
- Quality ratings (code, architecture, tests, docs)
- Test plan
- Screenshots (if UI)
- Merge recommendation: MERGE (8.5/10)

### 8. Merge & Release
```bash
# After PR approval and merge
git checkout main
git pull
/temn:temn-release-notes
```

**AI generates professional release notes from git history and specs.**

---

## Next Steps

### Explore Advanced Features

1. **Architecture Review**
   ```bash
   /temn:temn-architect
   ```

2. **Generate Diagrams**
   ```bash
   /temn:temn-diagram
   ```

3. **Debugging Assistance**
   ```bash
   /temn:temn-debug
   ```

4. **Product Roadmap**
   ```bash
   /temn:temn-roadmap
   ```

### Customize Your Setup

1. **Update project context** as your project evolves
2. **Add project-specific conventions** in project-context.md
3. **Create base product spec** for shared features:
   ```bash
   /temn:temn-requirements "Base CoreBank application with common features"
   # Save to .temn/specs/00-base-corebank/
   ```

### Learn More

- Read **`.temn/WORKFLOW.md`** for detailed workflows
- Explore **`.temn/standards/`** for quality standards
- Check **`.temn/tech-stacks/`** for tech stack specifics
- Run **`/temn:temn-tutorial`** for interactive learning

---

## Tips for Success

1. **Start small** - Try a simple feature first to learn the workflow
2. **Read the verification report** - It tells you exactly what to fix
3. **Use systematic workflow for complex features** - The plan helps break it down
4. **Don't be afraid of CONDITIONAL PASS** - It's normal, just fix the issues
5. **Keep project context updated** - It's the foundation for all commands
6. **Ask questions** - Use AI to clarify requirements before implementing

---

## Troubleshooting

### "Commands are not finding my files"
→ Run `/temn:temn-init --refresh` to update project context

### "Verification fails with FAIL status"
→ Read the verification report, fix critical issues, re-verify

### "AI is generating wrong tech stack"
→ Check `.temn/project-context.md`, update if needed, run `--refresh`

### "Tests are failing"
→ Run the tests locally: `npm test` or `mvn test`, fix failures, regenerate tests

### "Don't know which workflow to use"
→ Use Standard workflow (5 steps) for most features
→ Use Systematic workflow (with plan) for complex features

---

## Success Metrics

After using Temenos SDLC OS, you should see:
- ✅ Faster feature development (20-40% reduction)
- ✅ Higher test coverage (>80% consistently)
- ✅ Fewer bugs in production (quality gates catch issues)
- ✅ Better documentation (auto-generated specs and PRs)
- ✅ Consistent code quality across team

---

**Ready to start?** Run `/temn:temn-init` in your project!

---

**Questions?** Check `.temn/WORKFLOW.md` or run `/temn:temn-help`
