# Tech Stacks

This directory contains product-specific technology stack configurations for all Temenos projects.

---

## Purpose

Tech stacks define the complete technology configuration for a specific product type, including:
- Framework versions and configuration
- Architecture patterns and project structure
- Component libraries and design systems
- Development workflow and tooling
- Quality standards and best practices specific to the stack

**Tech stacks are product-specific**, while [coding conventions](../standards/coding-conventions/) are language-agnostic.

---

## Directory Structure

```
tech-stacks/
├── web-apps/              # Web application stacks
│   ├── uux-lit-ts.md     # Temenos UUX + Lit + TypeScript
│   ├── react-ts.md       # React + TypeScript
│   └── angular-ts.md     # Angular + TypeScript
├── backend-apis/          # Backend service stacks
│   ├── java-spring.md    # Java + Spring Boot
│   ├── nodejs-express.md # Node.js + Express
│   └── dotnet-core.md    # .NET Core + ASP.NET
├── mobile-apps/           # Mobile application stacks
│   ├── react-native.md   # React Native (iOS + Android)
│   ├── flutter.md        # Flutter (iOS + Android)
│   └── swift-ios.md      # Native iOS
├── desktop-apps/          # Desktop application stacks
│   ├── electron.md       # Electron (cross-platform)
│   └── dotnet-wpf.md     # .NET WPF (Windows)
├── cli-tools/             # Command-line tool stacks
│   ├── nodejs-cli.md     # Node.js CLI
│   └── go-cli.md         # Go CLI
└── libraries/             # Library stacks
    ├── java-library.md   # Java library
    └── npm-library.md    # NPM library
```

---

## Available Tech Stacks

### Web Applications

#### Temenos UUX + Lit + TypeScript
**File:** [web-apps/uux-lit-ts.md](web-apps/uux-lit-ts.md)
**For:** Temenos banking products, financial services UI
**Stack:** Lit 3.x + UUX web components + TypeScript + Vite
**When to use:**
- Building Temenos products
- Need UUX design system
- Web component architecture

#### React + TypeScript (Coming Soon)
**For:** Modern web applications, dashboards
**Stack:** React 18+ + TypeScript + Vite
**When to use:**
- Standard web applications
- Rich interactive UIs
- Large development teams

### Backend APIs

#### Java + Spring Boot
**File:** [backend-apis/java-spring.md](backend-apis/java-spring.md)
**For:** RESTful APIs, microservices, enterprise backends
**Stack:** Java 17+ + Spring Boot 3.x + PostgreSQL
**When to use:**
- Enterprise backends
- Complex business logic
- High transaction volumes

#### Node.js + Express (Coming Soon)
**For:** RESTful APIs, BFF (Backend for Frontend)
**Stack:** Node.js 20+ + Express + TypeScript
**When to use:**
- Fast API development
- JavaScript/TypeScript teams
- Real-time features

### Mobile Applications (Coming Soon)

#### React Native
**For:** Cross-platform mobile apps (iOS + Android)
**Stack:** React Native + TypeScript + Expo
**When to use:**
- Single codebase for iOS/Android
- Web developers building mobile apps
- Rapid prototyping

---

## How to Use

### For Developers

#### 1. Find Your Tech Stack
Identify the tech stack for your project:
```bash
# Check project-context.md
cat .temn/project-context.md | grep "Tech Stack"
```

#### 2. Read the Stack Documentation
Read your project's tech stack file thoroughly:
```bash
# Example for UUX Lit TypeScript
cat .temn/core/tech-stacks/web-apps/uux-lit-ts.md
```

#### 3. Follow Stack Standards
- Use specified framework versions
- Follow architecture patterns
- Use recommended libraries
- Apply stack-specific conventions

#### 4. Use Stack Tooling
Set up tools specified in the stack:
```bash
# Example for UUX Lit TypeScript
npm install  # Install dependencies
npm run dev  # Start development server
npm test     # Run tests
```

### For Claude Code Agents

Commands automatically read the relevant tech stack based on `project-context.md`:

```markdown
# Example: UUX Lit TypeScript project
Read @.temn/core/tech-stacks/web-apps/uux-lit-ts.md
Read @.temn/core/standards/coding-conventions/typescript-coding-standards.md
Read @.temn/core/standards/quality-standards.md
```

**Selective Reading:** Only the project's tech stack is read (not all stacks).

---

## Tech Stack vs Coding Conventions

### Tech Stacks (Product-Specific)
- **Scope:** Complete technology configuration for a product type
- **Contains:**
  - Framework versions and setup
  - Project structure
  - Component libraries
  - Architecture patterns
  - Development workflow
  - Testing strategy
- **Example:** UUX Lit TypeScript, Java Spring Boot
- **Location:** `.temn/tech-stacks/{category}/{stack-id}.md`

### Coding Conventions (Language-Agnostic)
- **Scope:** Language-specific coding style and best practices
- **Contains:**
  - Naming conventions
  - Type systems
  - Code organization
  - Error handling
  - Best practices
- **Example:** TypeScript coding standards, Java coding standards
- **Location:** `.temn/standards/coding-conventions/{language}-coding-standards.md`

### Relationship
```
Tech Stack = Framework + Architecture + Coding Conventions + Tools

Example:
uux-lit-ts.md = Lit 3.x + Context API + typescript-coding-standards.md + Vite
```

---

## Adding New Tech Stacks

### Process
1. **Identify need:** New product type or technology stack
2. **Create file:** `{category}/{stack-id}.md`
3. **Follow template:** Use existing stacks as template (see below)
4. **Get review:** Review by relevant guild (Frontend, Backend, Mobile)
5. **Update README:** Add to "Available Tech Stacks" section
6. **Update project-context.md:** If applicable
7. **Announce:** Notify teams

### Template Structure
```markdown
# Tech Stack: {Name}

**Product Type:** {Type}
**Category:** {Category}
**Stack ID:** {id}
**Version:** 1.0
**Last Updated:** {Date}

## Stack Overview
- Description
- Technology list
- When to use

## Technology Stack
- Core framework
- Libraries
- Tools
- Testing

## Architecture Patterns
- Project structure
- Code examples
- Common patterns

## Configuration
- Config files
- Setup instructions

## Development Workflow
- Setup
- Development
- Testing
- Deployment

## Quality Standards
- Code standards
- Performance targets
- Testing requirements

## Verification Checklist
- Pre-merge checklist

## Related Documents
- Links to standards

## Resources
- Documentation links
```

---

## Stack Versions and Updates

### Versioning
Tech stacks use semantic versioning:
- **Major (1.0.0 → 2.0.0):** Breaking changes (framework upgrade)
- **Minor (1.0.0 → 1.1.0):** New features, recommended libraries
- **Patch (1.0.0 → 1.0.1):** Clarifications, fixes

### Update Process
1. **Propose update:** Create PR with change rationale
2. **Test impact:** Test changes in sample project
3. **Review:** Stack owner reviews and approves
4. **Announce:** Notify teams 4 weeks before adoption
5. **Migration guide:** Provide migration documentation if breaking
6. **Grace period:** 90 days for projects to migrate
7. **Deprecation:** Mark old version deprecated

### Framework Version Policy
- **Stay current:** Use latest LTS versions when possible
- **Security patches:** Apply within 30 days
- **Major upgrades:** Plan with 6-month lead time
- **End-of-life:** Migrate before framework EOL

---

## Multi-Stack Projects

Some projects may use multiple stacks:

### Example: Full-Stack Application
```
Project: CoreBank Transaction Manager
├── Frontend: uux-lit-ts (web-apps)
├── Backend: java-spring (backend-apis)
└── Mobile: react-native (mobile-apps)
```

### project-context.md Configuration
```markdown
## Technical Stack

### Frontend
- Tech Stack: uux-lit-ts
- [Read stack documentation](.temn/core/tech-stacks/web-apps/uux-lit-ts.md)

### Backend
- Tech Stack: java-spring
- [Read stack documentation](.temn/core/tech-stacks/backend-apis/java-spring.md)
```

---

## Enforcement

### Automated
- **Dependency versions:** Lock file validation
- **Linters:** Stack-specific linter configs
- **CI/CD:** Build with stack-specified tools

### Manual
- **Code reviews:** Verify stack compliance
- **Architecture reviews:** Quarterly stack reviews
- **Audits:** Annual stack alignment audits

---

## Support

### Stack Owners
Each stack has an owner responsible for:
- Keeping stack documentation updated
- Reviewing stack update proposals
- Providing guidance to teams
- Maintaining sample projects

### Getting Help
- **Slack:** Stack-specific channels (#uux-lit, #java-spring, etc.)
- **Email:** Guild-specific emails
- **Office Hours:** Stack owner office hours
- **Samples:** Reference implementation projects

---

## Related Documents

- [Coding Conventions](../standards/coding-conventions/) - Language-specific standards
- [Quality Standards](../standards/quality-standards.md) - Cross-stack quality requirements
- [Security Standards](../standards/security-standards.md) - Security best practices
- [Workflow Standards](../standards/workflow-standards.md) - Development workflow
- [Project Context Guide](../docs/MULTI_PRODUCT_GUIDE.md) - Multi-product setup

---

**Last Updated:** 2025-01-11
**Maintained By:** Temenos Developer Experience Team
