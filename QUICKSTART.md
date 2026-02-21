# AI-Powered Development Quickstart

> **First Time?** Run these 2 commands in order, then pick your workflow path.

---

## Minimal Startup (5 minutes)

```bash
# 1. Initialize Claude Code context
/init

# 2. Load project configuration
/temn:temn-init
```

✅ **You're ready to develop**

---

## Pick Your Workflow

### Simple Feature (Most Common)
```
/temn:temn-requirements
  → /temn:temn-dev
  → /temn:temn-test
  → /temn:temn-verify
  → /temn:temn-pr
```

### Complex Feature (5+ components, new services)
```
/temn:temn-requirements
  → /temn:temn-plan
  → /temn:temn-dev
  → /temn:temn-test
  → /temn:temn-verify
  → /temn:temn-review
  → /temn:temn-pr
```

### Bug Fix
```
Direct code fix
  → /temn:temn-dev
  → /temn:temn-test
  → /temn:temn-verify
  → /temn:temn-pr
```

### Strategic Initiative (Epic-level)
```
/temn:temn-roadmap
  → /temn:temn-prd
  → /temn:temn-requirements
  → [continue above workflow]
```

---

## What Each Command Does

| Command | Purpose | Output |
|---------|---------|--------|
| `/init` | Load Claude Code context | Reads CLAUDE.md |
| `/temn:temn-init` | Load project config | Reads `.temn/project-context.md` |
| `/temn:temn-roadmap` | Strategic vision + OKRs | `.temn/specs/XX-feature/roadmap.md` |
| `/temn:temn-prd` | Business case + personas | `.temn/specs/XX-feature/prd.md` |
| `/temn:temn-requirements` | Functional requirements | `.temn/specs/XX-feature/spec.md` |
| `/temn:temn-tech-spec` | Architecture decisions | `.temn/specs/XX-feature/tech-spec.md` |
| `/temn:temn-plan` | Implementation breakdown | `.temn/specs/XX-feature/plan.md` |
| `/temn:temn-dev` | Generate full-stack code | Lit + Express + DataContext |
| `/temn:temn-test` | Generate tests (>80% coverage) | `*.test.ts`, `*.spec.ts` |
| `/temn:temn-verify` | Quality gate (MUST PASS) | Report card + fixes needed |
| `/temn:temn-review` | Code quality (9 categories) | Detailed review |
| `/temn:temn-pr` | Create pull request | GitHub PR link |

---

## Key Principles

- ✅ **Skip steps freely** - Any path works, any step optional
- ✅ **Each step reads prior outputs** - Automatic context awareness
- ✅ **Specs are auto-generated** - Stored in `.temn/specs/`
- ✅ **Full-stack in one command** - Backend + Frontend + State + Tests
- ✅ **Verify before PR** - `/temn:temn-verify` is the quality gate

---

## Project Info will be stored after temn-init

See `.temn/project-context.md` for full details.

---

## Need Help?

- **Commands:** Run `/temn-help`
