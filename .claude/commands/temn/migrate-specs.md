---
description: "Migrate legacy single-file specs to modular format (spec.yaml + spec-functional.md + spec-technical.md)"
allowed-tools: ["Read", "Write", "Glob", "Bash", "TodoWrite"]
---

# Specification Migration Tool

Migrate legacy single-file specifications (spec-{feature}.md) to modular format with three files:

- `spec.yaml` - Metadata and coordination
- `spec-functional.md` - Functional requirements
- `spec-technical.md` - Technical requirements

**Migration Benefits:**

- Two-phase requirements gathering workflow
- Better separation of concerns (product vs. engineering)
- Enables functional-only specifications
- Progressive elaboration support
- Improved traceability and quality scoring

---

## Usage

```bash
# Dry-run (show what would be migrated, no changes)
/temn:migrate-specs --dry-run

# Migrate specific feature
/temn:migrate-specs [feature-name]

# Migrate all legacy specs
/temn:migrate-specs --all

# Migrate with archive (moves legacy to _legacy/ subdirectory)
/temn:migrate-specs [feature-name] --archive

# Validate migration (check if already migrated)
/temn:migrate-specs [feature-name] --validate
```

**Arguments:**

- `feature-name` - Feature folder name (e.g., "04-recurring-payments") or just "recurring-payments"
- `--dry-run` - Show migration plan without making changes
- `--all` - Migrate all legacy specs in .temn/specs/
- `--archive` - Move legacy file to \_legacy/ subdirectory after successful migration
- `--validate` - Check if feature is already migrated (modular format)

**Examples:**

```bash
# Check what would be migrated
/temn:migrate-specs --dry-run

# Migrate one feature
/temn:migrate-specs 04-recurring-payments

# Migrate all, with archiving
/temn:migrate-specs --all --archive
```

---

## What It Does

1. **Identifies** legacy single-file specs (spec-{feature}.md)
2. **Backs up** original files before any changes
3. **Analyzes** content to classify sections (functional vs. technical)
4. **Generates** spec.yaml metadata with inferred values
5. **Splits** content into spec-functional.md and spec-technical.md
6. **Validates** migration success
7. **Archives** legacy files (optional)
8. **Reports** migration results

---

## Section Classification Logic

### Functional Sections (→ spec-functional.md)

**Patterns that indicate functional content:**

- Business Context, Business Value, ROI, User Value
- User Stories, User Personas, Use Cases
- Features (Must-Have, Should-Have, Could-Have, Out of Scope)
- User Workflows, User Journeys, User Actions
- Business Rules, Validation Rules, Business Logic
- Design Requirements, UX Requirements, Responsive Design
- Integration Points (functional perspective - "integrates with")
- Functional Acceptance Criteria
- Success Criteria, Success Metrics

**Section header patterns (regex):**

```regex
/(Business Context|User Stories|User Personas|Features|MVP|User Workflows|Business Rules|Design Requirements|UX|Integration Points|Functional.*Criteria|Success)/i
```

### Technical Sections (→ spec-technical.md)

**Patterns that indicate technical content:**

- Non-Functional Requirements (NFRs)
- Performance, Scalability, Reliability, Availability
- Security & Compliance, Authentication, Authorization, Encryption
- Audit Logging, PCI-DSS, GDPR, CCPA, SOC 2
- Risk & Failure Scenarios, Error Handling, Retry Logic
- Testing Requirements, Test Coverage, Test Strategy
- Technical Integration & Dependencies, API Design, Service Dependencies
- Assumptions & Constraints (technical), Technical Debt
- Data Model, API Endpoints, Request/Response Types
- UUX Components, Component Mapping, UI Components

**Section header patterns (regex):**

```regex
/(Non-Functional|NFR|Performance|Scalability|Reliability|Security|Compliance|Audit|Risk|Failure|Testing|Test.*Coverage|API.*Design|Data Model|Technical.*Integration|Assumptions.*Constraints|Technical.*Debt|UUX.*Component|UI.*Component|Component.*Mapping)/i
```

### Ambiguous Sections (Manual Review Needed)

Some sections could belong in either file based on content:

- **Integration** - Functional if "integrates with X feature", Technical if "API design patterns"
- **Data Requirements** - Functional if "display/collect data", Technical if "data model/schema"
- **Acceptance Criteria** - Split into functional AC and technical AC

**Strategy:** Analyze content, not just header. Look for keywords:

- **Functional keywords:** user, customer, workflow, feature, benefit, UI, display, input, click
- **Technical keywords:** API, service, endpoint, database, cache, performance, scalability, encryption

---

## Migration Process

### Step 1: Identify Legacy Specifications

```bash
# Find all feature folders
Glob: .temn/specs/*/

# For each folder, check format:
for each folder:
  has_modular = exists('spec.yaml')
  has_legacy = exists('spec-{feature}.md')

  if has_legacy and not has_modular:
    # Legacy format - candidate for migration
    legacy_specs.push(folder)
  elif has_modular and has_legacy:
    # Both exist - needs cleanup (warn user)
    both_formats.push(folder)
  elif has_modular:
    # Already migrated - skip
    migrated.push(folder)
```

**Filter based on arguments:**

- If `feature-name` specified: Migrate only that feature
- If `--all` specified: Migrate all legacy_specs
- If `--dry-run`: List candidates, no migration

### Step 2: Setup Todo Tracking

```typescript
TodoWrite({
  todos: [
    {
      content: "Identify legacy specifications",
      activeForm: "Identifying legacy specifications",
      status: "in_progress",
    },
    {
      content: "Backup legacy files",
      activeForm: "Backing up legacy files",
      status: "pending",
    },
    {
      content: "Analyze and classify sections",
      activeForm: "Analyzing and classifying sections",
      status: "pending",
    },
    {
      content: "Generate spec.yaml metadata",
      activeForm: "Generating spec.yaml metadata",
      status: "pending",
    },
    {
      content: "Split into functional/technical files",
      activeForm: "Splitting into functional/technical files",
      status: "pending",
    },
    {
      content: "Validate migration",
      activeForm: "Validating migration",
      status: "pending",
    },
    {
      content: "Archive legacy files (if --archive)",
      activeForm: "Archiving legacy files",
      status: "pending",
    },
    {
      content: "Generate migration report",
      activeForm: "Generating migration report",
      status: "pending",
    },
  ],
});
```

### Step 3: Backup Legacy Files

**CRITICAL:** Always backup before making changes.

```bash
# Create backup directory
mkdir -p .temn/specs/_backups/migration-{YYYYMMDD-HHMMSS}/

# For each legacy spec to migrate:
cp .temn/specs/{feature}/spec-{feature}.md \
   .temn/specs/_backups/migration-{YYYYMMDD-HHMMSS}/{feature}-spec-{feature}.md
```

**Log backup locations for rollback:**

```markdown
Backups created at:

- .temn/specs/\_backups/migration-20250117-143022/04-recurring-payments-spec-recurring-payments.md
- .temn/specs/\_backups/migration-20250117-143022/10-savings-goals-spec-savings-goals.md
```

### Step 4: Analyze Each Legacy Specification

**For each legacy spec:**

```typescript
Read: .temn/specs/{feature}/spec-{feature}.md

// Parse into sections
const sections = parseMarkdownSections(content);

// Classify each section
const classifications = sections.map(section => {
  return {
    header: section.header,
    content: section.content,
    type: classifySection(section.header, section.content),
    confidence: calculateConfidence(section)
  };
});

function classifySection(header, content) {
  // Check header patterns first
  if (FUNCTIONAL_PATTERNS.test(header)) {
    // Verify with content analysis
    if (hasFunctionalKeywords(content)) return 'functional';
  }

  if (TECHNICAL_PATTERNS.test(header)) {
    if (hasTechnicalKeywords(content)) return 'technical';
  }

  // Analyze content keywords
  const functionalScore = countFunctionalKeywords(content);
  const technicalScore = countTechnicalKeywords(content);

  if (functionalScore > technicalScore * 2) return 'functional';
  if (technicalScore > functionalScore * 2) return 'technical';

  // Ambiguous - default to functional (safer choice)
  return 'functional';
}
```

**Section Detection Patterns:**

```typescript
const FUNCTIONAL_PATTERNS =
  /^##\s*(Business Context|User Stories|User Personas|Features|MVP|Scope|User Workflows|Business Rules|UUX Components|Design Requirements|Integration Points|Functional.*Criteria|Success)/i;

const TECHNICAL_PATTERNS =
  /^##\s*(Non-Functional|NFR|Performance|Scalability|Security|Compliance|Risk|Failure|Testing|API.*Design|Data Model|Technical)/i;

const FUNCTIONAL_KEYWORDS = [
  "user",
  "customer",
  "workflow",
  "feature",
  "benefit",
  "UI",
  "display",
  "input",
  "click",
  "button",
  "form",
  "page",
  "screen",
  "navigation",
  "persona",
  "story",
  "scenario",
  "journey",
  "goal",
];

const TECHNICAL_KEYWORDS = [
  "API",
  "endpoint",
  "service",
  "database",
  "cache",
  "performance",
  "scalability",
  "encryption",
  "authentication",
  "compliance",
  "NFR",
  "latency",
  "throughput",
  "SLA",
  "uptime",
  "audit",
  "security",
];
```

### Step 5: Generate Metadata (spec.yaml)

**Infer metadata from legacy spec:**

```typescript
// Extract feature info
const featureId = extractFeatureId(folderName); // "04-recurring-payments"
const featureName = extractFeatureName(content); // "Recurring Payments" or infer from ID

// Extract dates
const created = extractDate(content, "Created") || TODAY;
const lastUpdated = extractDate(content, "Last Updated") || TODAY;

// Extract status
const status = extractStatus(content) || inferStatus(classifications);

// Calculate quality scores
const functionalScore = calculateFunctionalScore(functionalSections);
const technicalScore = hasTechnicalSections
  ? calculateTechnicalScore(technicalSections)
  : 0.0;
const overallScore = hasTechnicalSections
  ? (functionalScore + technicalScore) / 2
  : functionalScore;

// Extract dependencies
const dependencies = extractDependencies(content); // Look for "depends on", "requires"

// Extract tags
const tags = extractTags(content) || inferTags(content);

// Generate spec.yaml
const metadata = {
  feature: {
    id: featureId,
    name: featureName,
    version: "1.0",
    status: hasTechnicalSections ? "Ready for Planning" : "Functional Complete",
    created: created,
    last_updated: lastUpdated,
    owner: extractOwner(content) || "TBD",
    epic: extractEpic(content) || null,
  },
  sections: {
    functional: {
      file: "spec-functional.md",
      status: "complete",
      version: "1.0",
      last_updated: lastUpdated,
    },
    technical: {
      file: "spec-technical.md",
      status: hasTechnicalSections ? "complete" : "not_started",
      version: hasTechnicalSections ? "1.0" : "0.0",
      last_updated: lastUpdated,
    },
  },
  quality: {
    overall_score: overallScore,
    functional_score: functionalScore,
    technical_score: technicalScore,
    completeness: {
      functional: true,
      technical: hasTechnicalSections,
      acceptance_criteria: hasAcceptanceCriteria(content),
      test_requirements: hasTestRequirements(content),
    },
  },
  dependencies: dependencies,
  tags: tags,
};
```

**Quality Scoring Logic:**

```typescript
function calculateFunctionalScore(sections) {
  let score = 5.0; // Base score

  // Check for key sections
  if (hasSection(sections, "Business Context")) score += 0.5;
  if (hasSection(sections, "User Stories")) score += 1.0;
  if (hasSection(sections, "Features")) score += 1.0;
  if (hasSection(sections, "User Workflows")) score += 1.0;
  if (hasSection(sections, "Business Rules")) score += 0.5;
  if (hasSection(sections, "UUX Components")) score += 0.5;
  if (hasSection(sections, "Acceptance Criteria")) score += 1.0;

  // Cap at 10.0
  return Math.min(score, 10.0);
}

function calculateTechnicalScore(sections) {
  let score = 5.0; // Base score

  // Check for key sections
  if (hasSection(sections, "Non-Functional")) score += 1.0;
  if (hasSection(sections, "Security")) score += 1.0;
  if (hasSection(sections, "Performance")) score += 0.5;
  if (hasSection(sections, "Testing")) score += 1.0;
  if (hasSection(sections, "Risk")) score += 0.5;
  if (hasSection(sections, "Compliance")) score += 1.0;

  return Math.min(score, 10.0);
}
```

### Step 6: Split Into Functional and Technical Files

**Create spec-functional.md:**

```typescript
const functionalSections = classifications.filter(s => s.type === 'functional');

const functionalContent = `# ${featureName} - Functional Requirements

**Version:** 1.0
**Last Updated:** ${lastUpdated}
**Status:** Complete

---

${functionalSections.map(section => {
  return `## ${section.header}\n\n${section.content}\n\n`;
}).join('')}

---

**Related Files:**
- Metadata: spec.yaml
- Technical Requirements: spec-technical.md (if available)
`;

Write: .temn/specs/{feature}/spec-functional.md
```

**Create spec-technical.md (if has technical sections):**

```typescript
const technicalSections = classifications.filter(s => s.type === 'technical');

if (technicalSections.length > 0) {
  const technicalContent = `# ${featureName} - Technical Requirements

**Version:** 1.0
**Last Updated:** ${lastUpdated}
**Status:** Complete

---

${technicalSections.map(section => {
  return `## ${section.header}\n\n${section.content}\n\n`;
}).join('')}

---

**Related Files:**
- Metadata: spec.yaml
- Functional Requirements: spec-functional.md
`;

  Write: .temn/specs/{feature}/spec-technical.md
} else {
  // No technical sections - don't create file
  // spec.yaml will have technical.status = "not_started"
}
```

**Write spec.yaml:**

```typescript
const yamlContent = generateYAML(metadata);

Write: .temn/specs/{feature}/spec.yaml
```

### Step 7: Validate Migration

**Check migration success:**

```typescript
// Verify files created
const validations = [
  { file: "spec.yaml", exists: fileExists(".temn/specs/{feature}/spec.yaml") },
  {
    file: "spec-functional.md",
    exists: fileExists(".temn/specs/{feature}/spec-functional.md"),
  },
  {
    file: "spec-technical.md",
    expected: hasTechnicalSections,
    exists: fileExists(".temn/specs/{feature}/spec-technical.md"),
  },
];

// Verify content integrity
const originalSize = getFileSize(legacySpecPath);
const functionalSize = getFileSize(".temn/specs/{feature}/spec-functional.md");
const technicalSize =
  getFileSize(".temn/specs/{feature}/spec-technical.md") || 0;
const combinedSize = functionalSize + technicalSize;

// Size should be similar (±20% for added headers/metadata)
const sizeRatio = combinedSize / originalSize;
const sizeValid = sizeRatio >= 0.8 && sizeRatio <= 1.2;

// Validate spec.yaml is valid YAML
const yamlValid = validateYAML(".temn/specs/{feature}/spec.yaml");

// Final validation
const migrationValid =
  validations.every((v) => (v.expected ? v.exists : true)) &&
  sizeValid &&
  yamlValid;

if (!migrationValid) {
  // Rollback migration
  rollbackMigration(feature, backupPath);
  throw new Error(`Migration validation failed for ${feature}`);
}
```

### Step 8: Archive Legacy Files (if --archive)

**If --archive flag present:**

```bash
# Create _legacy directory in feature folder
mkdir -p .temn/specs/{feature}/_legacy

# Move legacy file
mv .temn/specs/{feature}/spec-{feature}.md \
   .temn/specs/{feature}/_legacy/spec-{feature}.md

# Add README explaining archive
cat > .temn/specs/{feature}/_legacy/README.md <<EOF
# Legacy Specification Archive

This directory contains the original single-file specification that was migrated to modular format.

**Migration Date:** ${MIGRATION_DATE}
**Original File:** spec-{feature}.md

**Current Modular Format:**
- ../spec.yaml - Metadata
- ../spec-functional.md - Functional requirements
- ../spec-technical.md - Technical requirements

**Backup Location:** .temn/specs/_backups/migration-${TIMESTAMP}/

To restore legacy format (if needed), copy file from backup directory.
EOF
```

### Step 9: Display Migration Report

**Generate comprehensive report:**

```typescript
const report = {
  timestamp: new Date().toISOString(),
  migrated_features: [...],
  failed_features: [...],
  warnings: [...],
  statistics: {
    total_legacy: legacySpecs.length,
    migrated: migratedCount,
    failed: failedCount,
    already_modular: alreadyModularCount
  }
};

// Write detailed report to file
Write: .temn/specs/_backups/migration-{YYYYMMDD-HHMMSS}/MIGRATION_REPORT.md
```

**Terminal output:**

```markdown
**Specification Migration Complete**

**Summary:**

- Migrated: ${migratedCount}/${totalCount} features
- Failed: ${failedCount}
- Warnings: ${warnings.length}

**Migrated Features:**
✓ 04-recurring-payments

- spec.yaml (metadata)
- spec-functional.md (285 lines)
- spec-technical.md (198 lines)
- Quality Score: 8.7/10

✓ 10-savings-goals

- spec.yaml (metadata)
- spec-functional.md (312 lines)
- spec-technical.md (not started)
- Quality Score: 9.0/10 (functional only)

**Warnings:**
⚠ 04-recurring-payments: Ambiguous section "Data Requirements" classified as functional (review recommended)
⚠ 10-savings-goals: No technical sections found - technical spec not created

**Backups Created:**

- Location: .temn/specs/\_backups/migration-20250117-143022/
- Contains original files for rollback if needed

**Next Steps:**

1. Review migrated specifications
2. Check classifications (functional vs. technical)
3. Add technical requirements to functional-only specs: /temn:temn-requirements enhance {feature}
4. Update commands to use modular format (already compatible via spec-reading-pattern)

**Full Report:**
.temn/specs/\_backups/migration-20250117-143022/MIGRATION_REPORT.md
```

---

## Rollback Procedure

If migration fails or produces incorrect results:

```bash
# Step 1: Identify backup
ls -la .temn/specs/_backups/

# Step 2: Restore from backup
BACKUP_DIR=".temn/specs/_backups/migration-20250117-143022"
FEATURE="04-recurring-payments"

# Remove migrated files
rm .temn/specs/${FEATURE}/spec.yaml
rm .temn/specs/${FEATURE}/spec-functional.md
rm .temn/specs/${FEATURE}/spec-technical.md

# Restore legacy file
cp ${BACKUP_DIR}/${FEATURE}-spec-${FEATURE}.md \
   .temn/specs/${FEATURE}/spec-${FEATURE}.md

# Step 3: Verify restoration
ls -la .temn/specs/${FEATURE}/
```

---

## Migration Report Format

**File:** `.temn/specs/_backups/migration-{YYYYMMDD-HHMMSS}/MIGRATION_REPORT.md`

````markdown
# Specification Migration Report

**Migration ID:** migration-20250117-143022
**Date:** 2025-01-17 14:30:22
**Initiated By:** User command
**Mode:** --all (migrate all legacy specs)

---

## Summary

| Metric                | Count |
| --------------------- | ----- |
| Total Legacy Specs    | 5     |
| Successfully Migrated | 4     |
| Failed                | 1     |
| Warnings              | 3     |
| Already Modular       | 2     |

---

## Successfully Migrated Features

### 04-recurring-payments

**Status:** ✓ Success
**Files Created:**

- spec.yaml (45 lines)
- spec-functional.md (285 lines, 12 sections)
- spec-technical.md (198 lines, 8 sections)

**Quality Scores:**

- Functional: 9.0/10
- Technical: 8.5/10
- Overall: 8.7/10

**Classification:**

- Functional: 12 sections (Business Context, User Stories, Features, Workflows, etc.)
- Technical: 8 sections (NFRs, Security, Testing, Risk, etc.)
- Ambiguous: 1 section (Data Requirements → classified as functional)

**Backup:** 04-recurring-payments-spec-recurring-payments.md

---

### 10-savings-goals

**Status:** ✓ Success (Functional Only)
**Files Created:**

- spec.yaml (42 lines)
- spec-functional.md (312 lines, 14 sections)
- spec-technical.md (not created - no technical sections found)

**Quality Scores:**

- Functional: 9.0/10
- Technical: 0.0/10 (not started)
- Overall: 9.0/10

**Classification:**

- Functional: 14 sections
- Technical: 0 sections

**Recommendation:** Add technical requirements with `/temn:temn-requirements enhance 10-savings-goals`

**Backup:** 10-savings-goals-spec-savings-goals.md

---

## Failed Migrations

### 15-payment-analytics

**Status:** ✗ Failed
**Reason:** Legacy spec file not found (spec-payment-analytics.md missing)
**Action:** Create specification with `/temn:temn-requirements payment-analytics`

---

## Warnings

1. **04-recurring-payments:** Ambiguous section "Data Requirements" - classified as functional based on keyword analysis. Manual review recommended.

2. **10-savings-goals:** No technical sections detected - spec-technical.md not created. Feature has functional-only specification.

3. **12-transaction-search:** Section "Integration Points" contains mix of functional and technical content. Split manually if needed.

---

## Validation Results

All migrated features passed validation:

- ✓ File existence checks
- ✓ Content size validation (±20% of original)
- ✓ YAML syntax validation
- ✓ Markdown structure validation

---

## Backup Information

**Backup Directory:** .temn/specs/\_backups/migration-20250117-143022/

**Backed Up Files:**

- 04-recurring-payments-spec-recurring-payments.md (1,245 KB)
- 10-savings-goals-spec-savings-goals.md (1,089 KB)
- 12-transaction-search-spec-transaction-search.md (892 KB)
- 14-user-preferences-spec-user-preferences.md (567 KB)

**Rollback Command:**

```bash
# To rollback specific feature:
cp .temn/specs/_backups/migration-20250117-143022/{feature}-spec-{feature}.md \
   .temn/specs/{feature}/spec-{feature}.md

# Remove migrated files
rm .temn/specs/{feature}/spec.yaml
rm .temn/specs/{feature}/spec-functional.md
rm .temn/specs/{feature}/spec-technical.md
```
````

---

## Next Steps

1. **Review Migrated Specifications**
   - Check functional/technical classification
   - Verify no content was lost
   - Validate quality scores

2. **Add Technical Requirements** (for functional-only specs)
   - 10-savings-goals: `/temn:temn-requirements enhance 10-savings-goals`

3. **Update Workflows**
   - All commands now support modular format via spec-reading-pattern
   - Use two-phase workflow for new features: `/temn:temn-requirements {feature}`

4. **Archive Legacy Files** (if not done already)
   - Run: `/temn:migrate-specs {feature} --archive`

5. **Remove Backups** (after validation period)
   - Keep backups for 30 days
   - Delete: `rm -rf .temn/specs/_backups/migration-20250117-143022/`

---

**Migration Completed Successfully**
**Total Time:** 2.3 seconds
**Status:** 4/5 features migrated, 1 failed (spec not found)

```

---

## Key Principles

✅ **Safety First** - Always backup before migration
✅ **Validation** - Verify content integrity after migration
✅ **Transparency** - Detailed reporting of all actions
✅ **Reversibility** - Easy rollback from backups
✅ **Intelligence** - Smart classification of functional vs. technical
✅ **Flexibility** - Support dry-run, single, batch, and archive modes
✅ **User Control** - User decides when to migrate, with clear next steps

**Migration enables progressive elaboration while maintaining backward compatibility!**
```
