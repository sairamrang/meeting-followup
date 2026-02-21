---
description: "Initialize project context by analyzing existing codebase or creating new project configuration"
allowed-tools: ["Task", "Read", "Write", "Glob", "Grep", "Bash", "AskUserQuestion"]
---

# Temenos Project Initializer

Intelligently initialize project context by analyzing existing codebases or guiding new project setup. All downstream commands depend on `.temn/project-context.md`.

---

## Usage

```bash
# Analyze existing codebase (DEFAULT)
/temn:temn-init

# Analyze with explicit path
/temn:temn-init --analyze [path]

# Create new project (interactive)
/temn:temn-init --new [project-name]

# Create base product definition
/temn:temn-init --base

# Analyze features and generate inventory
/temn:temn-init --analyze-features

# Re-analyze existing context
/temn:temn-init --refresh
```

---

## Modes

| Mode | Flag | Purpose |
|------|------|---------|
| **Analyze** | (default) | Scan existing codebase, detect tech stack |
| **New** | `--new` | Interactive setup for greenfield projects |
| **Base** | `--base` | Create 00-base product specification |
| **Features** | `--analyze-features` | Inventory existing features |
| **Refresh** | `--refresh` | Update existing context |

---

## Mode 1: Analyze Existing Codebase

### Process

1. **Scan** - Discover package files, configs, directories
2. **Detect** - Identify project type, framework, tooling
3. **Analyze** - Architecture, conventions, quality standards
4. **Clarify** - Ask user when ambiguous (confidence < 7)
5. **Generate** - Create `.temn/project-context.md`
6. **Update CLAUDE.md** - Add/update references to project context and core docs
7. **Report** - Display summary with recommendations

### Update CLAUDE.md

If `CLAUDE.md` exists, ensure it contains these references at the top:

```markdown
> **Project Context**: `.temn/project-context.md`
> **Standards**: `.temn/core/standards/` | **Tech Stack**: `.temn/core/tech-stacks/`
> **Workflow**: `.temn/core/WORKFLOW.md` | **Base Product**: `.temn/specs/00-base-*/`
```

If `CLAUDE.md` doesn't exist, create a minimal version with:
- Quick reference links (above)
- Link to project-context.md for configuration
- Link to core standards for conventions

### Detection Reference

**Read:** @.claude/agents/temn/_patterns/tech-stack-detection.md

Contains patterns for:
- Project types (web-app, mobile-app, backend-api, etc.)
- Frontend frameworks (Lit, React, Vue, Angular, Svelte)
- Component libraries (UUX, Material UI, Ant Design, etc.)
- Backend frameworks (Express, FastAPI, Spring Boot, etc.)
- State management (Redux, Zustand, Context, etc.)
- Testing frameworks (Vitest, Jest, Playwright, etc.)
- Architecture patterns (feature-based, layered, hexagonal)

### Detection Steps

```bash
# 1. Package files
Glob: "package.json"
Read: package.json

# 2. Build config
Glob: "vite.config.*" OR "webpack.config.*" OR "next.config.*"

# 3. Test config
Glob: "vitest.config.*" OR "jest.config.*" OR "playwright.config.*"

# 4. Verify framework usage
Grep: pattern="from ['\"](lit|react|vue)" path="src/**/*.{ts,tsx}"

# 5. Check component library
Grep: pattern="<uwc-|@mui|antd" path="src/**/*.{ts,tsx}"
```

### Ask When Ambiguous

```typescript
if (confidence < 7 || multipleDetected) {
  AskUserQuestion({
    questions: [{
      question: "I detected multiple patterns. Which is primary?",
      header: "Clarify",
      options: detectedOptions
    }]
  });
}
```

### Determine Claude Code Resources

Based on detection, populate the Claude Code Resources section:

**Stack Type Classification:**
```typescript
const stackType =
  (hasUI && hasBackend) ? "full-stack" :
  (hasUI && !hasBackend) ? "frontend-only" :
  (!hasUI && hasBackend) ? "backend-only" : "library";

const hasDesignSystem =
  componentLibrary !== null; // UUX, MUI, Ant Design, etc.
```

**Skills Detection:**
```typescript
// Check .claude/skills/ for applicable skills
const skills = [];

// UI projects
if (hasUI) {
  if (glob(".claude/skills/uux-dev/").exists) skills.push("uux-dev");
  if (glob(".claude/skills/ux-design/").exists) skills.push("ux-design");
}

// Language-specific
if (language === "infobasic") {
  if (glob(".claude/skills/infobasic/").exists) skills.push("infobasic");
}

// Always available
if (glob(".claude/skills/skill-creator/").exists) skills.push("skill-creator");
```

**Review Categories by Stack Type:**
| Stack Type | Categories | Count |
|------------|------------|-------|
| full-stack | Component, State, Design System, Data Flow, Performance, Accessibility, Testing, Code Quality, Type Safety | 9 |
| backend-only | API Architecture, Data Layer, Performance, Security, Testing, Code Quality, Type Safety | 7 |
| frontend-only | Component, State, Design System, Performance, Accessibility, Testing, Code Quality | 7 |

**Agents by Project Type:**
```typescript
const agents = [
  { cmd: "/temn:temn-architect", agent: "temn/temn-architect" },
  { cmd: "/temn:temn-plan", agent: "temn/temn-planner" },
  { cmd: "/temn:temn-review", agent: "temn/temn-code-reviewer" },
  { cmd: "/temn:temn-verify", agent: "temn/temn-verifier" },
];

// Add UI-specific agents
if (hasUI && hasDesignSystem) {
  agents.push({ cmd: "/temn:temn-review", agent: "uux/uux-design-reviewer" });
  agents.push({ cmd: "/temn:temn-test", agent: "uux/uux-test-generator" });
}
```

---

## Mode 2: Create New Project

### Interactive Questions

1. **Project Type** - Web app, Mobile, Backend API, Full-stack, Desktop, CLI, Library
2. **Business Domain** - Retail Banking, Wealth, Payments, E-commerce, etc.
3. **Tech Stack** - Framework, component library, build tool
4. **Architecture** - Feature-based, layered, hexagonal
5. **Conventions** - File naming, coverage target, accessibility standard
6. **Design System** - UUX, MUI, Ant Design, Tailwind, Custom, None
7. **Skills** - Auto-detect available skills in `.claude/skills/`
8. **Boilerplate** - Optional starter code generation

### Claude Code Resources (Auto-populated from answers)

Based on answers above, automatically populate:

```typescript
// From Q1 (Project Type)
const hasUI = ["Web app", "Mobile", "Full-stack", "Desktop"].includes(projectType);
const hasBackend = ["Backend API", "Full-stack"].includes(projectType);
const stackType = (hasUI && hasBackend) ? "full-stack" :
                  hasUI ? "frontend-only" : "backend-only";

// From Q6 (Design System)
const hasDesignSystem = designSystem !== "None";
const designSystemSkill = {
  "UUX": "uux-dev",
  "MUI": null,  // No skill yet
  "Ant Design": null,
  "Tailwind": null,
  "Custom": null,
  "None": null
}[designSystem];

// From Q7 (Skills) - scan .claude/skills/
const availableSkills = glob(".claude/skills/*/SKILL.md")
  .map(path => path.split("/")[2]);
```

### Tech Stack Options by Project Type

**Web Apps:**
- Frameworks: Lit+UUX, React, Vue, Angular, Svelte
- Build: Vite, Webpack, esbuild

**Mobile Apps:**
- Frameworks: React Native, Flutter, Native (Swift/Kotlin)

**Backend APIs:**
- Frameworks: Express, Fastify, NestJS, FastAPI, Django, Spring Boot
- Databases: PostgreSQL, MongoDB, MySQL, SQLite

---

## Mode 3: Create Base Product (--base)

Creates `00-base` spec with:
- Product vision and purpose
- Core features (auth, navigation, error handling)
- Domain model (entities, relationships)
- Technical architecture
- Security and accessibility requirements
- Performance targets
- Quality standards

### Process

1. Read project context
2. Check for existing base spec
3. Gather product info (interactive)
4. Generate comprehensive base spec
5. Create README

### Output

```
.temn/specs/00-base-{product}/
├── spec-base-{product}.md
└── README.md
```

---

## Mode 4: Analyze Features (--analyze-features)

Scans codebase to identify implemented features for:
- Legacy codebase understanding
- Undocumented functionality
- Migration planning
- Feature inventory

### Process

1. Read project context
2. Scan for components, routes, services, controllers
3. Group related files into features
4. Analyze complexity and dependencies
5. Generate feature inventory
6. Optional: Create spec stubs

### Output

```
.temn/analysis/feature-inventory-{date}.md
```

---

## Output: project-context.md (Lean Format ~80 lines)

```markdown
# Project Context

**Generated:** {date}
**Last Updated:** {date}

---

## Project Identity

| Property | Value |
|----------|-------|
| **Name** | {name} |
| **Type** | {web-app | api | library | mobile-app} |
| **Category** | {business-domain} |
| **Description** | {brief description} |

---

## Technical Stack References

| Layer | Stack | Reference |
|-------|-------|-----------|
| **Frontend** | {framework} | `.temn/core/tech-stacks/frontend/{stack}.md` |
| **Backend** | {framework} | `.temn/core/tech-stacks/backend/{stack}.md` |
| **Testing** | {framework} | `.temn/core/tech-stacks/testing/{stack}.md` |

**Standards:** `.temn/core/standards/` (quality, security, accessibility, coding conventions)

---

## Claude Code Resources

### Project Classification

| Property | Value |
|----------|-------|
| **Stack Type** | {full-stack | backend-only | frontend-only} |
| **Has UI** | {true | false} |
| **Has Backend** | {true | false} |
| **Has Design System** | {true | false} |

### Skills

| Skill | Path | Purpose |
|-------|------|---------|
| {skill} | `.claude/skills/{skill}/` | {purpose} |

### Design System (if applicable)

| Resource | Path |
|----------|------|
| **Components** | {path} |
| **Foundations** | {path} |

### Review Categories ({stack-type}: {N} categories)

{category} ({weight}%), {category} ({weight}%), ...

### Agents

| Command | Agent |
|---------|-------|
| {command} | {agent} |

---

## Project-Specific Overrides

### {Override Category}
- {specific override}

---

**Note:** For directory structure, conventions, and workflow, see `CLAUDE.md`. For detailed stack patterns, see referenced files above.
```

**Key principle:** Reference, don't duplicate. Keep project-context.md under 100 lines.

---

## Terminal Output (60-100 lines)

```markdown
**Project Analysis Complete**

✓ Codebase scanned successfully

**Project Identity:**
- Name: {name}
- Type: {type}
- Framework: {framework}
- Component Library: {library}

**Architecture:**
- Pattern: {pattern}
- Files analyzed: {count}

**Tech Stack:**
| Layer | Technology |
|-------|------------|
| Frontend | {framework} |
| Backend | {backend} |
| State | {state} |
| Testing | {test} |

**Confidence:** X/10

**Claude Code Resources Detected:**
- Stack Type: {full-stack | backend-only | frontend-only}
- Skills: {skill-1}, {skill-2}
- Review Categories: {N} categories
- Design System: {path or "none"}

**Warnings:** (if any)
**Recommendations:** (if any)

**Files Generated/Updated:**
- [project-context.md](.temn/project-context.md) - Project configuration
- [CLAUDE.md](CLAUDE.md) - Updated with references

**Next Steps:**
1. Review project-context.md
2. Verify Claude Code Resources section
3. Review/create base spec in `.temn/specs/00-base-*/`
4. Run /temn:temn-requirements
```

---

## Integration

All commands read `.temn/project-context.md` first:

| Command | Uses Context For |
|---------|------------------|
| **temn-requirements** | Component library, accessibility standard |
| **temn-architect** | Tech stack, architecture pattern, **review categories** |
| **temn-dev** | Conventions, styling approach, **skills** |
| **temn-test** | Test framework, coverage target, **agents** |
| **temn-verify** | Quality standards |
| **temn-review** | **Skills**, **agents** (design reviewer if UI project) |

**New: Claude Code Resources section** tells commands:
- Which **skills** to load from `.claude/skills/`
- Which **agents** to use for each command
- Which **review categories** apply (stack-dependent)
- Where to find **design system reference** (if applicable)

---

## Error Handling

### Low Confidence (< 7)
- Show ambiguities detected
- Ask clarifying questions
- Report uncertainty

### No Package Files
```
❌ No package management files found

Solutions:
1. Navigate to project root
2. Use --new for greenfield
3. Create package.json manually
```

### Conflicting Patterns
- Report conflicts detected
- Ask user to resolve
- Document decision

---

## Key Principles

- **Detective mindset** - Infer from evidence, don't assume
- **Multiple signals** - Check deps AND code AND files
- **Ask when unsure** - Confidence < 7 = ask user
- **Honest reporting** - Report limitations
- **Non-destructive** - Never overwrite without asking

---

## Examples

### Existing Lit + UUX Project
```bash
/temn:temn-init
# ✓ web-app, Lit 3.x, UUX, feature-based
# Confidence: 9/10
```

### New Flutter Mobile App
```bash
/temn:temn-init --new my-mobile-app
# Interactive: Mobile → Flutter → Retail Banking
# ✓ Configuration created
```

### Refresh After Adding Zustand
```bash
npm install zustand
/temn:temn-init --refresh
# ✓ Detected new state management: Zustand
# ✓ Updated project-context.md
```
