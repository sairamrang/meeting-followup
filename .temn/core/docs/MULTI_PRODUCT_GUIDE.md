# Multi-Product Command System Guide

## Overview

The Temenos command system now supports **any product type** across your company - not just UUX web apps. Commands intelligently adapt based on project context.

## Quick Start

### For Existing Projects

```bash
# 1. Initialize project context (analyzes your codebase)
/temn:temn-init

# 2. Review generated context
cat .temn/project-context.md

# 3. Start using commands - they'll adapt automatically
/temn:temn-requirements
```

### For New Projects

```bash
# 1. Create project directory
mkdir my-project && cd my-project

# 2. Initialize with interactive setup
/temn:temn-init --new my-project

# 3. Follow prompts to configure tech stack

# 4. Start developing
/temn:temn-requirements
```

---

## Supported Product Types

| Type | Examples | Auto-Detected |
|------|----------|---------------|
| **Web Application** | React, Vue, Angular, Lit + UUX, Svelte | ✅ |
| **Mobile Application** | React Native, Flutter, iOS (Swift), Android (Kotlin) | ✅ |
| **Backend API** | Express, FastAPI, Spring Boot, ASP.NET | ✅ |
| **Full-Stack** | Next.js, Remix, SvelteKit, Nuxt | ✅ |
| **Desktop App** | Electron, Tauri, WPF | ✅ |
| **CLI Tool** | Node.js, Python, Go, Rust | ✅ |
| **Library** | npm package, pip package, Maven artifact | ✅ |

---

## How It Works

### Project Context File

All commands read `.temn/project-context.md` to understand:
- Project type (web, mobile, backend, etc.)
- Tech stack (frameworks, languages, tools)
- Architecture patterns
- Code conventions
- Quality standards

### Command Adaptation

Commands automatically adapt their behavior:

**Example: `/temn:temn-requirements`**

```typescript
// For UUX web app:
- Asks about UWC components (<uwc-button>, <uwc-card>, etc.)
- References Temenos design system
- Includes WCAG 2.2 AA requirements

// For React Native mobile app:
- Asks about native components (View, Text, TouchableOpacity)
- References iOS HIG and Material Design
- Includes mobile-specific patterns (gestures, navigation)

// For backend API:
- Skips UI questions entirely
- Focuses on REST endpoints and data models
- Emphasizes API security and validation
```

---

## Project Context Structure

```markdown
# .temn/project-context.md

## Project Identity
- Name, type, category, description

## Technical Stack
- Frontend: Framework, components, language, build tool
- Backend: Runtime, framework, database, API style
- State: Pattern, data flow
- Testing: Unit, E2E, coverage target

## Architecture
- Pattern (feature-based, layered, hexagonal, microservices)
- Directory structure
- Key directories

## Code Conventions
- File naming (kebab-case, camelCase, PascalCase)
- Import style (relative, path aliases)
- Code style (ESLint, Prettier)

## Component Patterns
- Component libraries used
- Design system
- Styling approach

## Quality Standards
- Test coverage target
- Accessibility standard
- Browser/platform support

## Context for AI Agents
- Specific instructions for each command
- What to use, what to avoid
- Conventions to follow
```

---

## Detection Accuracy

`/temn:temn-init` uses multiple signals for high accuracy:

1. **Dependencies** - Check package.json, pom.xml, requirements.txt, etc.
2. **File Patterns** - Analyze actual code files and imports
3. **Directory Structure** - Examine project organization
4. **Config Files** - Read tsconfig, vite.config, etc.
5. **Usage Patterns** - Grep for framework-specific syntax

**Confidence Scoring:**
- 9-10/10: Very confident (proceed automatically)
- 7-8/10: Confident (minimal clarification)
- 5-6/10: Uncertain (ask clarifying questions)
- <5/10: Low confidence (interactive setup recommended)

---

## Example Scenarios

### Scenario 1: UUX Web App (Your Current Setup)

```bash
/temn:temn-init

# Detects:
# - Type: web-app
# - Framework: Lit 3.x
# - Components: Temenos UUX
# - Architecture: feature-based
# - Confidence: 9/10
```

Commands will:
- Reference `@.claude/skills/uux-dev/reference/` for UWC components
- Use `<uwc-*>` components in implementations
- Follow UUX design patterns
- Ensure WCAG 2.2 AA compliance

### Scenario 2: React + Material UI

```bash
/temn:temn-init

# Detects:
# - Type: web-app
# - Framework: React 18
# - Components: Material UI
# - Architecture: feature-based
# - Confidence: 8/10
```

Commands will:
- Use Material UI components (`<Button>`, `<TextField>`, etc.)
- Follow Material Design principles
- Use React hooks and patterns
- Skip UUX-specific references

### Scenario 3: FastAPI Backend

```bash
/temn:temn-init

# Detects:
# - Type: backend-api
# - Framework: FastAPI
# - Database: PostgreSQL
# - Architecture: layered
# - Confidence: 9/10
```

Commands will:
- Skip all UI component questions
- Focus on REST endpoint design
- Emphasize data models and validation
- Include API security patterns
- No frontend code generation

### Scenario 4: React Native Mobile

```bash
/temn:temn-init

# Detects:
# - Type: mobile-app
# - Framework: React Native
# - Components: React Native Paper
# - Platform: iOS + Android
# - Confidence: 8/10
```

Commands will:
- Use React Native components
- Include mobile-specific patterns (navigation, gestures)
- Reference iOS HIG and Material Design
- Consider touch targets and mobile UX

---

## Workflow Integration

### Standard Workflow (Any Product Type)

```bash
# 1. Initialize (one-time)
/temn:temn-init

# 2. Create specifications
/temn:temn-requirements

# 3. Design architecture (optional)
/temn:temn-architect

# 4. Create development plan (optional for complex features)
/temn:temn-plan

# 5. Implement
/temn:temn-dev

# 6. Generate tests
/temn:temn-test

# 7. Verify requirements
/temn:temn-verify

# 8. Create PR
/temn:temn-pr

# 9. Release notes (after merge)
/temn:temn-release-notes
```

**Key Difference:** Commands adapt automatically to project type - no manual configuration needed!

---

## Updating Project Context

### When to Update

Update `.temn/project-context.md` when:
- Adding new dependencies or frameworks
- Changing architecture patterns
- Adopting new conventions
- Upgrading major versions

### How to Update

**Option 1: Automatic Refresh**
```bash
/temn:temn-init --refresh
```
Re-scans codebase and updates context.

**Option 2: Manual Edit**
```bash
# Edit directly
code .temn/project-context.md

# Update specific sections as needed
```

---

## Migrating from Hard-Coded Commands

### Before (UUX-only):
Commands assumed:
- Lit + UUX components
- Specific directory structure
- UUX design system

### After (Multi-product):
Commands read context and adapt:
- Any framework
- Any component library
- Any architecture pattern

### Migration Steps:

1. **Run init:**
   ```bash
   /temn:temn-init
   ```

2. **Review generated context:**
   ```bash
   cat .temn/project-context.md
   ```

3. **Update if needed:**
   - Manually correct any misdetections
   - Add project-specific notes

4. **Test commands:**
   ```bash
   /temn:temn-requirements
   # Verify it reads context correctly
   ```

5. **Commit to git:**
   ```bash
   git add .temn/project-context.md
   git commit -m "chore: add project context for multi-product support"
   ```

---

## Best Practices

### ✅ Do's

- Run `/temn:temn-init` on every new project
- Review and validate generated context
- Commit `.temn/project-context.md` to version control
- Refresh context after major dependency changes
- Document project-specific conventions in context file

### ❌ Don'ts

- Don't skip initialization - commands need context
- Don't ignore low confidence warnings
- Don't manually create context without template
- Don't forget to refresh after tech stack changes

---

## Troubleshooting

### Issue: Commands don't adapt to my project

**Cause:** Project context not initialized or outdated

**Solution:**
```bash
/temn:temn-init --refresh
cat .temn/project-context.md  # Verify detection
```

### Issue: Wrong framework detected

**Cause:** Multiple frameworks in dependencies or unusual setup

**Solution:**
1. Review `.temn/project-context.md`
2. Edit "Technical Stack" section manually
3. Save and test commands

### Issue: Low confidence warning

**Cause:** Ambiguous codebase (multiple frameworks, mixed patterns)

**Solution:**
1. Answer clarifying questions when prompted
2. Or manually specify in interactive mode:
   ```bash
   /temn:temn-init --new [project-name]
   ```

### Issue: Commands still reference UUX for non-UUX project

**Cause:** Context not loaded or command cache issue

**Solution:**
1. Verify `.temn/project-context.md` exists
2. Check "Component Library" is not "UUX"
3. Clear cache: `/clear` and retry

---

## Advanced: Custom Project Types

### Adding Support for New Frameworks

If your project uses a framework not yet detected, you can:

1. **Manually update context:**
   ```markdown
   ## Technical Stack

   ### Frontend
   - **Framework:** CustomFramework 1.0
   - **Component Library:** CustomUI
   ```

2. **Report for future detection:**
   - Document framework detection patterns
   - Contribute to command improvements

### Company-Wide Standards

To enforce company standards across all projects:

1. **Create template:**
   ```bash
   # .temn/templates/project-context-template.md
   ```

2. **Set defaults:**
   ```markdown
   ## Quality Standards
   - Test Coverage: >80% (company standard)
   - Accessibility: WCAG 2.2 AA (required)
   - Code Review: Required before merge
   ```

3. **Use in new projects:**
   ```bash
   /temn:temn-init --new my-project --template company-standard
   ```

---

## Benefits

✅ **Reusability** - Commands work with any tech stack
✅ **Consistency** - Same workflow across all product types
✅ **Intelligence** - Auto-detects project characteristics
✅ **Flexibility** - Easy to add new product types
✅ **Maintainability** - Context changes don't require command updates
✅ **Portability** - `.temn/` folder can be copied to similar projects

---

## Future Enhancements

Planned improvements:
- Template library for common project types
- Auto-detection of more frameworks (Qwik, Solid, Astro)
- Integration with company-wide conventions
- AI-powered architecture recommendations
- Multi-repo/monorepo support
- CI/CD pipeline generation

---

## Support

For issues or questions:
1. Review this guide
2. Check command documentation: `.claude/commands/temn/temn-init.md`
3. Run `/temn:temn-help` for command reference
4. Contact Temenos DevEx team

---

**Version:** 1.0
**Last Updated:** 2025-01-10
**Maintained By:** Temenos Developer Experience Team
