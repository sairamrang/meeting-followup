# Audience Content Extractors

Pattern for extracting spec content based on target audience.

## Audience Definitions

### Executive
**Purpose:** High-level business value for C-level, board presentations
**Format:** PPTX (8-10 slides)
**Tone:** Strategic, outcome-focused, minimal technical detail

### Business
**Purpose:** Detailed requirements for product managers, business analysts
**Format:** DOCX (~12 pages)
**Tone:** Comprehensive, process-focused, stakeholder-oriented

### Technical
**Purpose:** Implementation details for developers, architects
**Format:** DOCX (~18 pages)
**Tone:** Precise, code-oriented, architecture-focused

### All
**Purpose:** Complete specification for archival, sign-off
**Format:** HTML (default) or PDF
**Tone:** Comprehensive, all audiences

---

## Content Extraction Map

### From spec.yaml

| Field | Executive | Business | Technical | All |
|-------|-----------|----------|-----------|-----|
| feature.name | ✓ Title | ✓ Title | ✓ Title | ✓ |
| feature.version | ✓ | ✓ | ✓ | ✓ |
| feature.status | ✓ Badge | ✓ | ✓ | ✓ |
| feature.epic | ✓ Context | ✓ | - | ✓ |
| quality.overall_score | ✓ Health | ✓ | ✓ | ✓ |
| tags | - | ✓ | ✓ | ✓ |
| dependencies | - | ✓ | ✓ | ✓ |

### From spec-functional.md

| Section | Executive | Business | Technical | All |
|---------|-----------|----------|-----------|-----|
| Overview | ✓ Problem/Solution | ✓ Full | ✓ Summary | ✓ |
| Business Value | ✓ Slide | ✓ Full | - | ✓ |
| Target Users | ✓ Brief | ✓ Full | - | ✓ |
| User Stories | ✓ 2-3 key | ✓ Full | ✓ Summary | ✓ |
| Features (P0) | ✓ List only | ✓ Full detail | ✓ List | ✓ |
| Features (P1) | - | ✓ Table | - | ✓ |
| Out of Scope | - | ✓ | - | ✓ |
| UUX Components | - | ✓ Table | ✓ Table | ✓ |
| Business Rules | - | ✓ Full | ✓ Summary | ✓ |
| User Workflows | ✓ 1 key flow | ✓ Full | - | ✓ |
| Design Requirements | - | ✓ Visual specs | ✓ Technical | ✓ |
| Integration Points | - | ✓ Navigation | ✓ API table | ✓ |
| Acceptance Criteria | - | ✓ Checklist | ✓ Checklist | ✓ |
| Success Metrics | ✓ KPI slide | ✓ Table | - | ✓ |
| Notes & Assumptions | - | ✓ | ✓ | ✓ |

### From spec-technical.md

| Section | Executive | Business | Technical | All |
|---------|-----------|----------|-----------|-----|
| Architecture Overview | ✓ Simplified | - | ✓ Full diagram | ✓ |
| File Structure | - | - | ✓ Full | ✓ |
| Type Definitions | - | - | ✓ Full | ✓ |
| API Specification | - | ✓ Table only | ✓ Full + samples | ✓ |
| Component Specs | - | - | ✓ Full | ✓ |
| State Management | - | - | ✓ Full | ✓ |
| Non-Functional Reqs | ✓ Performance only | - | ✓ Full | ✓ |
| Security | - | ✓ Summary | ✓ Full | ✓ |
| Error Handling | - | ✓ User messages | ✓ Full | ✓ |
| Testing Strategy | - | - | ✓ Full | ✓ |
| Dependencies | - | - | ✓ Tables | ✓ |
| Implementation Checklist | ✓ Timeline | - | ✓ Full | ✓ |

### From _artifacts/

| Content | Executive | Business | Technical | All |
|---------|-----------|----------|-----------|-----|
| Diagrams (exec/overview) | ✓ 1-2 | - | - | ✓ |
| Diagrams (workflow/journey) | - | ✓ | - | ✓ |
| Diagrams (architecture/data) | - | - | ✓ | ✓ |
| All diagrams | - | - | - | ✓ |
| Images (mockups) | ✓ 1-2 key | ✓ All | - | ✓ |
| Figma embeds | - | ✓ | - | ✓ |

---

## Extraction Functions

### extractForExecutive(spec)

```javascript
function extractForExecutive(spec, functional, technical) {
  return {
    // Slide 1: Title
    title: spec.feature.name,
    status: spec.feature.status,
    version: spec.feature.version,
    score: spec.quality.overall_score,
    epic: spec.feature.epic,

    // Slide 2: Problem
    problem: extractSection(functional, 'Overview', 'first-paragraph'),

    // Slide 3: Solution
    solution: extractSection(functional, 'Overview', 'after-business-value'),
    features: extractBullets(functional, 'Features', 'P0-names-only'),

    // Slide 4: Business Value
    businessValue: extractBullets(functional, 'Business Value'),

    // Slide 5: Success Metrics
    metrics: extractTable(functional, 'Success Metrics'),

    // Slide 6: User Impact
    users: extractSection(functional, 'Target Users'),
    keyWorkflow: extractSection(functional, 'User Workflows', 'first-workflow'),

    // Slide 7: Timeline
    phases: extractChecklist(technical, 'Implementation Checklist', 'phase-headers'),

    // Slide 8: Next Steps
    // Generated based on status
  };
}
```

### extractForBusiness(spec)

```javascript
function extractForBusiness(spec, functional, technical) {
  return {
    metadata: spec.feature,
    quality: spec.quality,

    // Full functional content
    overview: extractSection(functional, 'Overview'),
    userStories: extractSection(functional, 'User Stories'),
    features: {
      p0: extractSection(functional, 'Features', 'Must Have'),
      p1: extractSection(functional, 'Features', 'Should Have'),
      outOfScope: extractSection(functional, 'Out of Scope'),
    },
    uuxComponents: extractTable(functional, 'UUX Components'),
    businessRules: extractSection(functional, 'Business Rules'),
    workflows: extractSection(functional, 'User Workflows'),
    designRequirements: extractSection(functional, 'Design Requirements'),
    acceptanceCriteria: extractSection(functional, 'Acceptance Criteria'),
    successMetrics: extractTable(functional, 'Success Metrics'),

    // Selected technical content
    apiOverview: extractTable(technical, 'API Specification', 'endpoints-table'),
    securitySummary: extractSection(technical, 'Security', 'summary'),
    errorMessages: extractTable(technical, 'Error Handling', 'user-messages'),

    // Artifacts
    diagrams: filterDiagrams(['workflow', 'journey', 'user']),
    images: getAllImages(),
  };
}
```

### extractForTechnical(spec)

```javascript
function extractForTechnical(spec, functional, technical) {
  return {
    metadata: spec.feature,
    quality: spec.quality,

    // Context from functional
    overview: extractSection(functional, 'Overview', 'summary'),
    acceptanceCriteria: extractSection(functional, 'Acceptance Criteria'),
    uuxComponents: extractTable(functional, 'UUX Components'),

    // Full technical content
    architecture: extractSection(technical, 'Architecture Overview'),
    fileStructure: extractCodeBlock(technical, 'File Structure'),
    types: extractCodeBlock(technical, 'Type Definitions'),
    api: extractSection(technical, 'API Specification'),
    components: extractSection(technical, 'Component Specifications'),
    stateManagement: extractSection(technical, 'State Management'),
    nfr: extractSection(technical, 'Non-Functional Requirements'),
    security: extractSection(technical, 'Security'),
    errorHandling: extractSection(technical, 'Error Handling'),
    testing: extractSection(technical, 'Testing Strategy'),
    dependencies: extractSection(technical, 'Dependencies'),
    checklist: extractSection(technical, 'Implementation Checklist'),
    technicalAC: extractSection(technical, 'Technical Acceptance Criteria'),

    // All diagrams
    diagrams: getAllDiagrams(),
  };
}
```

---

## Section Extraction Helpers

### extractSection(markdown, heading, subSelector?)

Extracts content under a markdown heading.

```javascript
// Extract full section
extractSection(functional, 'Overview')
// Returns: Full content from ## Overview to next ## heading

// Extract with sub-selector
extractSection(functional, 'Features', 'Must Have')
// Returns: Content from ### Must Have (P0) to next ### heading
```

### extractTable(markdown, heading, tableName?)

Extracts markdown tables as structured data.

```javascript
extractTable(functional, 'Success Metrics')
// Returns: [{ Metric: '...', Target: '...', Measurement: '...' }, ...]
```

### extractBullets(markdown, heading)

Extracts bullet points as array.

```javascript
extractBullets(functional, 'Business Value')
// Returns: ['Self-Service Security: ...', 'Visual Excellence: ...', ...]
```

### extractCodeBlock(markdown, heading)

Extracts fenced code blocks.

```javascript
extractCodeBlock(technical, 'Type Definitions')
// Returns: TypeScript code as string
```

---

## Diagram Filtering

Diagrams are filtered by filename patterns:

| Pattern | Audience | Description |
|---------|----------|-------------|
| `*-exec-*`, `*-overview-*` | Executive | High-level diagrams |
| `*-workflow-*`, `*-journey-*`, `*-user-*` | Business | Process flows |
| `*-arch-*`, `*-data-*`, `*-component-*` | Technical | Architecture diagrams |
| `*` | All | All diagrams |

---

## Usage in Spec Render

```javascript
// In temn-spec-render command
const audience = args.audience || defaultAudienceForFormat(args.format);
const extracted = extractForAudience(spec, functional, technical, audience);

switch (args.format) {
  case 'pptx':
    await generatePPTX(extracted, outputPath);
    break;
  case 'docx':
    await generateDOCX(extracted, audience, outputPath);
    break;
  case 'pdf':
    await generatePDF(extracted, outputPath);
    break;
  default:
    await generateHTML(spec, functional, technical, outputPath);
}
```

---

## Default Audience by Format

| Format | Default Audience |
|--------|------------------|
| html | all |
| pptx | executive |
| docx | business |
| pdf | all |
