# Specification Reading Pattern

This document defines the reusable pattern for reading feature specifications across all commands. It supports both modular format (spec.yaml + spec-functional.md + spec-technical.md) and legacy format (spec-{feature}.md).

---

## Quick Reference

```typescript
// In your command, use this pattern:

Read: @.temn/core/lib/spec-reading-pattern.md

const featurePath = 'features/{feature}';
const NEEDS_TECHNICAL = true; // or false, based on command needs

// Apply the 5-step pattern below
// Returns: SpecContext object
```

---

## Usage in Commands

When updating commands to use this pattern:

1. **Add spec reading section** (usually Step 1)
2. **Set `NEEDS_TECHNICAL`** based on command requirements
3. **Apply the 5-step pattern** to load specification
4. **Pass spec context to agents** via prompt template

---

## Pattern Implementation

### Step 1: Determine Feature Path

```typescript
// Feature path can be:
// - Provided as argument: {feature}
// - Extracted from current directory
// - Inferred from context

const featurePath = `features/${featureName}`;
```

### Step 2: Check for Modular Format (spec.yaml)

```typescript
// Check if modular format exists
const specYamlPath = `${featurePath}/spec.yaml`;
const hasModularFormat = fileExists(specYamlPath);

if (hasModularFormat) {
  // Proceed to Step 3: Read Modular Format
} else {
  // Proceed to Step 4: Fall Back to Legacy Format
}
```

### Step 3: Read Modular Format

```typescript
// Read spec.yaml for metadata
Read: ${featurePath}/spec.yaml

// Parse YAML to get metadata
const metadata = parseYAML(specYamlContent);

// Read functional specification (always required)
Read: ${featurePath}/spec-functional.md
const functional = functionalContent;

// Read technical specification (if available)
const technicalPath = `${featurePath}/spec-technical.md`;
const hasTechnical = fileExists(technicalPath) &&
                     metadata.sections.technical.status !== 'not_started';

let technical = null;
if (hasTechnical) {
  Read: ${featurePath}/spec-technical.md
  technical = technicalContent;
}

// Validate completeness
if (NEEDS_TECHNICAL && !hasTechnical) {
  logWarning(`Technical requirements not yet defined for ${featureName}`);
  logWarning(`Run: /temn:temn-requirements enhance ${featureName}`);
}

// Return SpecContext (see Step 5)
```

### Step 4: Fall Back to Legacy Format

```typescript
// Check for legacy single-file format
const legacyPath = `${featurePath}/spec-${featureName}.md`;

if (!fileExists(legacyPath)) {
  throw Error(`No specification found for feature: ${featureName}

  Expected either:
  - ${featurePath}/spec.yaml (modular format)
  - ${legacyPath} (legacy format)

  Create specification with: /temn:temn-requirements ${featureName}`);
}

// Read legacy specification
Read: ${legacyPath}

// Legacy format contains both functional and technical in one file
// We treat it as complete for backward compatibility
const metadata = null; // No metadata in legacy format
const functional = legacyContent; // Entire content
const technical = legacyContent; // Same content (not separated)
const hasTechnical = true; // Assume complete

// Return SpecContext (see Step 5)
```

### Step 5: Validate and Return

```typescript
// Create SpecContext object
const specContext: SpecContext = {
  metadata: metadata, // object | null
  functional: functional, // string (always present)
  technical: technical, // string | null
  hasTechnical: hasTechnical, // boolean
  format: hasModularFormat ? "modular" : "legacy", // 'modular' | 'legacy'
};

// Validate required sections
if (!specContext.functional || specContext.functional.trim().length === 0) {
  throw Error(`Empty functional specification for feature: ${featureName}`);
}

// Return for use in command
return specContext;
```

---

## Return Structure

```typescript
interface SpecContext {
  // Metadata from spec.yaml (null for legacy format)
  metadata: {
    feature: {
      id: string;
      name: string;
      version: string;
      status: string;
      created: string;
      last_updated: string;
      owner?: string;
      epic?: string;
    };
    sections: {
      functional: {
        file: string;
        status: "complete" | "partial" | "not_started";
        version: string;
        last_updated: string;
      };
      technical: {
        file: string;
        status: "complete" | "partial" | "not_started";
        version: string;
        last_updated: string;
      };
    };
    quality: {
      overall_score: number;
      functional_score: number;
      technical_score: number;
      completeness: {
        functional: boolean;
        technical: boolean;
        acceptance_criteria: boolean;
        test_requirements: boolean;
      };
    };
    dependencies?: string[];
    tags?: string[];
  } | null;

  // Functional requirements (always present)
  functional: string;

  // Technical requirements (may be null)
  technical: string | null;

  // Whether technical section exists and is not empty
  hasTechnical: boolean;

  // Format type
  format: "modular" | "legacy";
}
```

---

## Error Handling

### Specification Not Found

```typescript
// No spec.yaml and no spec-{feature}.md
Error: No specification found for feature: {feature}

Expected either:
- features/{feature}/spec.yaml (modular format)
- features/{feature}/spec-{feature}.md (legacy format)

Create specification with: /temn:temn-requirements {feature}
```

### Technical Requirements Missing (Warning)

```typescript
// Modular format with technical status: 'not_started'
// AND command has NEEDS_TECHNICAL = true

Warning: Technical requirements not yet defined for {feature}

This command works best with complete technical requirements (NFRs, security, testing).

Options:
1. Add technical requirements: /temn:temn-requirements enhance {feature}
2. Continue with functional-only (may create incomplete plan/architecture)

Proceeding with functional requirements only...
```

### Empty Specification

```typescript
// Specification file exists but is empty
Error: Empty specification file: {path}

Please populate the specification or regenerate with:
/temn:temn-requirements {feature}
```

---

## Examples

### Example 1: Command Requiring Technical (e.g., temn-plan)

```markdown
### Step 1: Read Specification

Read: @.temn/core/lib/spec-reading-pattern.md

const featurePath = 'features/recurring-payments';
const NEEDS_TECHNICAL = true; // Planning requires NFRs, security, testing strategy

// Check for modular format
if (exists('features/recurring-payments/spec.yaml')) {
// Read spec.yaml
// Read spec-functional.md
// Read spec-technical.md (if available)

if (technical.status === 'not_started') {
logWarning('Technical requirements not defined - plan may be incomplete');
logWarning('Run: /temn:temn-requirements enhance recurring-payments');
}
} else if (exists('features/recurring-payments/spec-recurring-payments.md')) {
// Read legacy format (complete specification)
}

// specContext now available for agent prompt
```

### Example 2: Command Not Requiring Technical (e.g., temn-dev)

```markdown
### Step 1: Read Specification

Read: @.temn/core/lib/spec-reading-pattern.md

const featurePath = 'features/recurring-payments';
const NEEDS_TECHNICAL = false; // Dev can start with functional requirements

// Apply pattern to load specification
// No warnings if technical missing - dev can work with functional only

// specContext now available for agent prompt
```

### Example 3: Using Spec Context in Agent Prompt

```typescript
Task({
  subagent_type: "uux/uux-planner",
  prompt: `Create development plan for: ${featurePath}

**SPECIFICATION CONTEXT:**

${
  spec.metadata
    ? `
## Metadata
Feature: ${spec.metadata.feature.name}
Version: ${spec.metadata.feature.version}
Status: ${spec.metadata.feature.status}
Quality Score: ${spec.metadata.quality.overall_score}/10
`
    : ""
}

## Functional Requirements
${spec.functional}

${
  spec.technical
    ? `
## Technical Requirements
${spec.technical}
`
    : `
## Technical Requirements
⚠ Not yet defined - creating plan from functional requirements only.
NFR tasks will be added when technical spec is enhanced.
`
}

[... rest of prompt ...]
`,
});
```

---

## Integration Checklist

When adding this pattern to a command:

- [ ] Add "Read Specification" step (usually Step 1)
- [ ] Reference this pattern: `Read: @.temn/core/lib/spec-reading-pattern.md`
- [ ] Set `NEEDS_TECHNICAL` based on command needs
- [ ] Apply 5-step pattern to load specification
- [ ] Handle both modular and legacy formats
- [ ] Log warning if technical missing and `NEEDS_TECHNICAL = true`
- [ ] Pass `specContext` to agent prompt with template
- [ ] Update agent prompt to consume specification context

---

**Version:** 1.0
**Last Updated:** 2025-01-17
**Related:** `.temn/core/lib/spec-schema.yaml`
