# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Project Context**: `.temn/project-context.md`
> **Standards**: `.temn/core/standards/` | **Tech Stack**: `.temn/core/tech-stacks/`
> **Workflow**: `.temn/core/WORKFLOW.md` | **Specs**: `.temn/specs/`

---

## Repository Overview

This is the **Temenos SDLC OS** (Software Development Lifecycle Operating System) - an AI-powered development framework that provides a complete workflow from requirements to deployment. The repository contains Claude Code commands, agents, skills, standards, and tech stack configurations.

**Key Locations:**
- `QUICKSTART.md` - 5-minute setup guide
- `.temn/core/` - Standards, tech stacks, and documentation
- `.claude/` - Commands, agents, and skills

---

## Essential Commands

### Initialization (Run First)

```bash
# 1. Initialize Claude Code context (reads this file)
/init

# 2. Load project configuration
/temn:temn-init
```

### Primary Development Workflow

```bash
# Simple feature (most common):
/temn:temn-requirements "feature description"  # Create spec
/temn:temn-dev                                  # Generate code
/temn:temn-test                                 # Generate tests
/temn:temn-verify                               # Quality gate
/temn:temn-pr                                   # Create PR

# Complex feature (5+ components):
/temn:temn-requirements "feature description"
/temn:temn-plan                                 # Detailed plan
/temn:temn-dev                                  # Generate code
/temn:temn-test
/temn:temn-verify
/temn:temn-review                               # Code quality review
/temn:temn-pr

# Bug fix (direct):
/temn:temn-dev "bug description"
/temn:temn-test
/temn:temn-verify
/temn:temn-pr
```

### Available Commands

| Command | Purpose |
|---------|---------|
| `/temn:temn-init` | Initialize/refresh project context |
| `/temn:temn-requirements` | Create feature specification |
| `/temn:temn-tech-spec` | Generate architecture decisions |
| `/temn:temn-plan` | Create implementation breakdown |
| `/temn:temn-dev` | Generate full-stack code (backend + frontend + state) |
| `/temn:temn-test` | Generate comprehensive test suite |
| `/temn:temn-verify` | Quality gate verification (MUST PASS before PR) |
| `/temn:temn-review` | Code + design quality review |
| `/temn:temn-pr` | Create pull request |
| `/temn:temn-prd` | Generate product requirements doc |
| `/temn:temn-roadmap` | Strategic vision + OKRs |
| `/temn:temn-architect` | Architecture review |
| `/temn:temn-diagram` | Generate architecture diagrams |
| `/temn:temn-ux-review` | UX/design review from screenshots |
| `/temn:temn-release-notes` | Generate release notes |
| `/temn:temn-help` | List all commands |

---

## Architecture

### Three-Layer System

```
┌─────────────────────────────────────────────────────────┐
│ 1. Commands (/temn:temn-*)                              │
│    User-facing commands that orchestrate workflows      │
│    Location: .claude/commands/temn/                     │
└─────────────────────────────────────────────────────────┘
                         ↓ delegates to
┌─────────────────────────────────────────────────────────┐
│ 2. Agents                                                │
│    Specialized AI agents for specific tasks              │
│    Location: .claude/agents/temn/                       │
└─────────────────────────────────────────────────────────┘
                         ↓ references
┌─────────────────────────────────────────────────────────┐
│ 3. Skills                                                │
│    Domain expertise and reference materials              │
│    Location: .claude/skills/                            │
└─────────────────────────────────────────────────────────┘
```

### Core Directories

**`.temn/core/` - Universal Standards & Tech Stacks**
```
core/
├── standards/              # Universal development standards
│   ├── quality-standards.md         # Test coverage (>80%), performance
│   ├── security-standards.md        # OWASP Top 10, authentication
│   ├── accessibility-standards.md   # WCAG 2.2 AA compliance
│   ├── workflow-standards.md        # Git workflow, branching
│   └── coding-conventions/          # Language-specific standards
│       ├── typescript-coding-standards.md
│       └── java-coding-standards.md
├── tech-stacks/            # Product-specific tech configurations
│   ├── web-apps/
│   │   └── uux-lit-ts.md           # Lit + UUX + TypeScript stack
│   ├── backend-apis/
│   │   └── java-spring.md          # Java + Spring Boot stack
│   └── transact/                   # Temenos Transact specifics
└── docs/
    ├── QUICK_START.md              # Detailed quick start
    └── MULTI_PRODUCT_GUIDE.md      # Multi-product support
```

**`.claude/` - Claude Code Extensions**
```
.claude/
├── commands/temn/          # User commands (24 commands)
├── agents/temn/            # AI agents for code generation, review, etc.
│   ├── uux/               # UUX-specific agents
│   └── _patterns/         # Shared patterns and templates
├── skills/                 # Domain expertise
│   ├── uux-dev/           # UUX web component development
│   ├── ux-design/         # UX design patterns
│   ├── infobasic/         # InfoBasic language support
│   ├── docx/              # Word document generation
│   ├── pptx/              # PowerPoint generation
│   ├── pdf/               # PDF generation
│   └── skill-creator/     # Meta-skill for creating new skills
└── hooks/                  # Lifecycle hooks (e.g., cost tracking)
```

### Project Context System

**Central File: `.temn/project-context.md`**

All commands read this file to understand:
- Project type (web-app, backend-api, mobile-app, etc.)
- Tech stack (frameworks, libraries, tools)
- Architecture patterns (feature-based, layered, etc.)
- Quality standards (coverage targets, performance)
- Component patterns (design system, state management)
- **Claude Code Resources** (skills, agents, review categories)

Commands automatically adapt based on project context - the same command works for React, Vue, Angular, or Lit projects.

### Specification System

**Location: `.temn/specs/XX-feature-name/`**

Each feature has a dedicated specification directory:
```
.temn/specs/
├── 00-base-app/              # Base product definition
│   ├── spec-base-app.md     # Core features, domain model
│   └── README.md
└── 01-feature-name/          # Feature specification
    ├── spec-feature-name.md  # Requirements & acceptance criteria
    ├── plan-feature-name.md  # Development plan (optional)
    ├── tech-spec-feature-name.md  # Architecture decisions (optional)
    └── _artifacts/           # Reviews, diagrams, verification
```

**Specification reads prior outputs** - Each command automatically reads relevant prior specs for context awareness.

### Full-Stack Code Generation

Commands generate complete vertical slices:
- **Backend**: Express routes, services, adapters, fixtures
- **Shared Types**: TypeScript interfaces used by frontend & backend
- **Frontend API Client**: Type-safe service layer
- **State Management**: DataContext integration (Lit Context API)
- **UI Components**: Lit components using UUX web components

---

## Key Patterns

### 1. Context API Pattern (State Management)

```typescript
// DataContext for backend data
@provide({ context: accountContext })
export class AccountDataContext extends LitElement {
  @state() accounts: Account[] = [];
  @state() loading = false;

  async fetchAccounts() {
    this.loading = true;
    this.accounts = await accountService.getAccounts();
    this.loading = false;
  }
}

// Components consume context
@customElement('account-list')
export class AccountList extends LitElement {
  @consume({ context: accountContext, subscribe: true })
  @state() accounts: Account[] = [];
}
```

### 2. Adapter Pattern (Backend Integration)

```typescript
export class AccountService {
  constructor(private apiClient: ApiClient) {}

  async getAccounts(): Promise<Account[]> {
    const response = await this.apiClient.get('/api/accounts');
    return response.data.map(AccountAdapter.toDomain);
  }
}
```

### 3. Tech Stack Detection

Commands use multi-signal detection:
1. **Dependencies** - package.json, pom.xml, requirements.txt
2. **File Patterns** - imports, syntax, directory structure
3. **Config Files** - vite.config, tsconfig, etc.
4. **Usage Patterns** - grep for framework-specific code

**Confidence scoring:** 9-10/10 = auto-proceed, 7-8/10 = minimal clarification, <7/10 = ask user

### 4. Standards Hierarchy

```
Universal Standards (all projects)
    ↓ applies to
Language-Specific Conventions (TypeScript, Java, etc.)
    ↓ applied in
Tech Stack Configuration (Lit+UUX, Spring Boot, etc.)
    ↓ used in
Project Implementation (your code)
```

---

## Quality Gates

### Verification Statuses

- **PASS ✅** - All criteria met, ready to merge
- **CONDITIONAL PASS ⚠️** - Minor issues, fix and re-verify (normal)
- **FAIL ❌** - Critical issues, significant rework needed

**Normal flow:** CONDITIONAL PASS → Fix issues → PASS

### Quality Targets

- Test coverage: >80%
- Accessibility: WCAG 2.2 AA compliance (for UI)
- Performance: <3s page load, <500ms API response (P95)
- Security: No OWASP Top 10 vulnerabilities
- Zero tolerance: `any` types, dead code, hardcoded secrets

---

## Important Workflows

### When Commands Read Context

| Command | Reads |
|---------|-------|
| **temn-requirements** | project-context.md, 00-base spec |
| **temn-plan** | spec.md, tech-spec.md, project-context.md |
| **temn-dev** | spec.md, plan.md, project-context.md, standards, tech-stack |
| **temn-test** | spec.md, generated code, project-context.md |
| **temn-verify** | spec.md, all code, quality-standards.md |
| **temn-review** | All code, standards, skills (design-review if UI) |

### Skills-Based Approach

Commands invoke **skills** based on project type:
- **uux-dev** - Lit + UUX web component development
- **ux-design** - UX patterns, accessibility, interaction design
- **infobasic** - InfoBasic language for Temenos Transact
- **docx/pptx/pdf** - Document generation

Skills are auto-detected and referenced in `.temn/project-context.md`.

### Agent Delegation

Commands delegate to specialized agents:
- **temn-requirements-agent** - Gathers requirements via questions
- **temn-planner** - Creates implementation breakdown
- **full-stack implementation agent** - Generates backend + frontend code
- **uux-test-generator** - Generates comprehensive test suites
- **temn-verifier** - Validates against acceptance criteria
- **temn-code-reviewer** - 9-category code review
- **uux-design-reviewer** - Design system compliance (if UI project)

---

## Critical Rules

### DO

1. **Always run `/temn:temn-init` first** - Sets up project context
2. **Read specifications before coding** - Commands auto-read, but verify understanding
3. **Run `/temn:temn-verify` before PR** - Quality gate is mandatory
4. **Fix CRITICAL and HIGH issues** - Before merging
5. **Keep project-context.md updated** - After major tech stack changes
6. **Follow the standards** - Read `.temn/core/standards/` for your language

### DON'T

1. **Don't skip verification** - `/temn:temn-verify` must pass
2. **Don't ignore CRITICAL issues** - These block merge
3. **Don't modify `.temn/core/` directly** - These are shared standards
4. **Don't merge with FAIL status** - Fix and re-verify
5. **Don't create features without specs** - Unless trivial (<20 lines)

---

## Reference Files to Read

When working on any task, commands automatically reference:

**Universal (All Projects):**
- `.temn/project-context.md` - Project configuration
- `.temn/core/standards/quality-standards.md`
- `.temn/core/standards/security-standards.md`
- `.temn/core/standards/workflow-standards.md`

**UI Projects Only:**
- `.temn/core/standards/accessibility-standards.md`
- `.claude/skills/uux-dev/` - UUX component reference
- `.claude/skills/ux-design/` - UX patterns

**Language-Specific:**
- `.temn/core/standards/coding-conventions/typescript-coding-standards.md`
- `.temn/core/standards/coding-conventions/java-coding-standards.md`

**Tech Stack:**
- `.temn/core/tech-stacks/web-apps/uux-lit-ts.md`
- `.temn/core/tech-stacks/backend-apis/java-spring.md`

---

## Quick Reference

### Minimal Startup (First Time)
```bash
/init                    # Load this file
/temn:temn-init          # Load project context
```

### Feature Development
```bash
/temn:temn-requirements  # Create spec
/temn:temn-dev          # Generate code
/temn:temn-test         # Generate tests
/temn:temn-verify       # Verify quality
/temn:temn-pr           # Create PR
```

### Multi-Product Support
The same commands work across:
- Web apps (React, Vue, Angular, Lit, Svelte)
- Mobile apps (React Native, Flutter, iOS, Android)
- Backend APIs (Express, Spring Boot, FastAPI, Django)
- Desktop apps (Electron, Tauri)
- CLI tools (Node.js, Go, Python)
- Libraries (npm, Maven, pip)

Commands auto-adapt based on `.temn/project-context.md`.

---

## Hooks System

The repository includes a PostToolUse hook for automatic cost tracking:
- **Location**: `.claude/hooks/cost-tracker.sh`
- **Triggers**: After any `/temn:*` command completes
- **Purpose**: Logs command executions to `.claude/costs/command-costs.csv`
- **Configuration**: See `.claude/settings.local.json`

For details, see [.claude/hooks/README.md](.claude/hooks/README.md)

---

**Last Updated:** 2026-01-27
