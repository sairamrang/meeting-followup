# Business DOCX Pattern

Generate a comprehensive business requirements document from specification content.

## Document Structure (~12-14 pages)

```
1. Title Page
2. Table of Contents
3. Executive Summary
4. User Stories
5. Features & Requirements
   5.1 Must Have (P0)
   5.2 Should Have (P1)
   5.3 Out of Scope
6. User Workflows
7. Business Rules
8. UX Components
9. Design Requirements
10. Acceptance Criteria
11. API Overview
12. Success Metrics
13. Appendix
```

---

## Section Details

### 1. Title Page

```
┌────────────────────────────────────────────┐
│                                            │
│  ████████████████████████████████████████  │
│                                            │
│         [FEATURE NAME]                     │
│                                            │
│    Business Requirements Document          │
│                                            │
│  ──────────────────────────────────────    │
│                                            │
│  Version: 1.0                              │
│  Status: Ready for Development             │
│  Quality Score: 8.8/10                     │
│  Generated: January 14, 2025               │
│                                            │
│  Epic: Cards & Payments                    │
│  Owner: Product Team                       │
│                                            │
└────────────────────────────────────────────┘
```

**Content Source:**
- `spec.yaml → feature.*`
- `spec.yaml → quality.overall_score`

### 2. Table of Contents

Auto-generated from HeadingLevel styles.

### 3. Executive Summary

| Subsection | Source |
|------------|--------|
| Overview | `spec-functional.md → Overview → first 2 paragraphs` |
| Business Value | `spec-functional.md → Business Value (all bullets)` |
| Target Users | `spec-functional.md → Target Users` |
| Key Metrics | `spec-functional.md → Success Metrics → top 3` |

### 4. User Stories

Full content from `spec-functional.md → User Stories`

Format as numbered list:
1. As a [role], I want to [action], so that [benefit]

### 5. Features & Requirements

**5.1 Must Have (P0)**

From `spec-functional.md → Features → Must Have (P0)`

For each feature:
- Feature name (H3)
- Description
- Visual Design (if present)
- Layout (if present)
- Expected Behavior

**5.2 Should Have (P1)**

Table format from `spec-functional.md → Features → Should Have (P1)`

| Feature | Description | Deferred To |
|---------|-------------|-------------|

**5.3 Out of Scope**

Bullet list from `spec-functional.md → Out of Scope`

### 6. User Workflows

Full content from `spec-functional.md → User Workflows`

Include workflow diagrams if available (`*-workflow-*.mmd`, `*-journey-*.mmd`)

### 7. Business Rules

Tables from `spec-functional.md → Business Rules`

### 8. UX Components

Table from `spec-functional.md → UUX Components`

| Component | Usage |
|-----------|-------|

### 9. Design Requirements

From `spec-functional.md → Design Requirements`:
- Visual Specifications
- Responsive Breakpoints
- Animations
- States
- Accessibility

Include mockup images from `_artifacts/images/`

### 10. Acceptance Criteria

Checklist format from `spec-functional.md → Acceptance Criteria`

**P0 - Must Pass:**
- [ ] Criterion 1
- [ ] Criterion 2

**Edge Cases:**
- [ ] Edge case 1

### 11. API Overview

Table from `spec-technical.md → API Specification → Endpoints table`

| Endpoint | Method | Purpose |
|----------|--------|---------|

(Details intentionally abbreviated - full API in technical spec)

### 12. Success Metrics

Table from `spec-functional.md → Success Metrics`

| Metric | Target | Measurement |
|--------|--------|-------------|

### 13. Appendix

- Notes & Assumptions from `spec-functional.md`
- Dependencies from `spec.yaml`
- Related documents

---

## Styling

### Fonts

| Element | Font | Size |
|---------|------|------|
| Title | Arial Bold | 28pt |
| Heading 1 | Arial Bold | 18pt |
| Heading 2 | Arial Bold | 14pt |
| Heading 3 | Arial Bold | 12pt |
| Body | Arial | 11pt |
| Table | Arial | 10pt |
| Code | Courier New | 10pt |

### Colors

| Element | Hex |
|---------|-----|
| Heading 1 | `1A1F71` (Primary Blue) |
| Heading 2 | `2E77BB` (Secondary Blue) |
| Heading 3 | `1E293B` (Dark Gray) |
| Body | `1E293B` |
| Table Header BG | `1A1F71` |
| Table Header Text | `FFFFFF` |
| Table Alt Row | `F8FAFC` |
| Hyperlink | `2E77BB` |

### Margins

Standard professional: 1 inch (1440 DXA) all sides

---

## docx-js Implementation

```javascript
const { Document, Packer, Paragraph, TextRun, HeadingLevel,
        Table, TableRow, TableCell, WidthType, ShadingType,
        TableOfContents, PageBreak, ImageRun } = require('docx');

async function generateBusinessDoc(extracted, outputPath) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22 }, // 11pt
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 36, bold: true, color: '1A1F71' },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 28, bold: true, color: '2E77BB' },
          paragraph: { spacing: { before: 200, after: 100 } },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 24, bold: true, color: '1E293B' },
          paragraph: { spacing: { before: 160, after: 80 } },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        // Title page
        ...createTitlePage(extracted.metadata),

        // Page break
        new Paragraph({ children: [new PageBreak()] }),

        // TOC
        new TableOfContents('Table of Contents', {
          hyperlink: true,
          headingStyleRange: '1-3',
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Content sections
        ...createExecutiveSummary(extracted),
        ...createUserStories(extracted.userStories),
        ...createFeatures(extracted.features),
        ...createWorkflows(extracted.workflows, extracted.diagrams),
        ...createBusinessRules(extracted.businessRules),
        ...createUXComponents(extracted.uuxComponents),
        ...createDesignRequirements(extracted.designRequirements, extracted.images),
        ...createAcceptanceCriteria(extracted.acceptanceCriteria),
        ...createAPIOverview(extracted.apiOverview),
        ...createSuccessMetrics(extracted.successMetrics),
        ...createAppendix(extracted),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
}

function createTitlePage(metadata) {
  return [
    // Header bar (using table with single cell)
    new Table({
      columnWidths: [9360], // Full width
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: '1A1F71', type: ShadingType.CLEAR },
              children: [new Paragraph({ text: ' ' })],
            }),
          ],
        }),
      ],
    }),

    // Spacing
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),

    // Title
    new Paragraph({
      children: [new TextRun({ text: metadata.name, bold: true, size: 56 })],
      alignment: 'center',
    }),

    // Subtitle
    new Paragraph({
      children: [new TextRun({ text: 'Business Requirements Document', size: 32, color: '64748B' })],
      alignment: 'center',
    }),

    // Spacing
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),

    // Metadata
    new Paragraph({
      children: [new TextRun({ text: `Version: ${metadata.version}`, size: 24 })],
      alignment: 'center',
    }),
    new Paragraph({
      children: [new TextRun({ text: `Status: ${metadata.status}`, size: 24 })],
      alignment: 'center',
    }),
  ];
}

function createTable(headers, rows) {
  return new Table({
    columnWidths: headers.map(() => Math.floor(9360 / headers.length)),
    rows: [
      // Header row
      new TableRow({
        tableHeader: true,
        children: headers.map(header =>
          new TableCell({
            shading: { fill: '1A1F71', type: ShadingType.CLEAR },
            children: [new Paragraph({
              children: [new TextRun({ text: header, color: 'FFFFFF', bold: true })],
            })],
          })
        ),
      }),
      // Data rows
      ...rows.map((row, index) =>
        new TableRow({
          children: row.map(cell =>
            new TableCell({
              shading: index % 2 === 0 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
              children: [new Paragraph({ text: cell })],
            })
          ),
        })
      ),
    ],
  });
}
```

---

## Diagram Embedding

Convert Mermaid diagrams to PNG before embedding:

```javascript
const { execSync } = require('child_process');

function embedDiagram(diagramPath, doc) {
  const pngPath = diagramPath.replace('.mmd', '.png');
  execSync(`npx mmdc -i ${diagramPath} -o ${pngPath} -w 600`);

  const imageData = fs.readFileSync(pngPath);

  return new Paragraph({
    children: [
      new ImageRun({
        data: imageData,
        type: 'png',
        transformation: { width: 500, height: 300 },
        altText: {
          title: 'Workflow Diagram',
          description: 'User workflow visualization',
          name: 'workflow-diagram',
        },
      }),
    ],
  });
}
```

---

## Checklist Formatting

For acceptance criteria:

```javascript
function createChecklist(items) {
  return items.map(item =>
    new Paragraph({
      children: [
        new TextRun({ text: '☐ ', font: 'Segoe UI Symbol' }),
        new TextRun({ text: item }),
      ],
    })
  );
}
```

---

## Output Validation

Before saving, verify:
- [ ] All sections present
- [ ] TOC generates correctly (uses HeadingLevel)
- [ ] Tables render with proper styling
- [ ] Images embedded and scaled
- [ ] Page breaks in correct locations
- [ ] No orphaned headers

---

## File Output

Save to: `.temn/specs/{feature}/_artifacts/spec-business.docx`
