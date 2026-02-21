# Technical DOCX Pattern

Generate a comprehensive technical specification document for developers.

## Document Structure (~18-20 pages)

```
1. Title Page
2. Table of Contents
3. Feature Context
4. Architecture Overview
5. File Structure
6. Type Definitions
7. API Specification
8. Component Specifications
9. State Management
10. Non-Functional Requirements
11. Security
12. Error Handling
13. Testing Strategy
14. Dependencies
15. Implementation Checklist
16. Technical Acceptance Criteria
17. Appendix (All Diagrams)
```

---

## Section Details

### 1. Title Page

```
┌────────────────────────────────────────────┐
│  ████████████████████████████████████████  │
│                                            │
│         [FEATURE NAME]                     │
│                                            │
│    Technical Specification                 │
│                                            │
│  ──────────────────────────────────────    │
│                                            │
│  Version: 1.0                              │
│  Status: Technical Complete                │
│  Quality Score: 8.9/10 (Technical)         │
│  Generated: January 14, 2025               │
│                                            │
└────────────────────────────────────────────┘
```

### 2. Table of Contents

Auto-generated from HeadingLevel styles.

### 3. Feature Context (from Functional)

Brief context from functional spec:
- Overview summary (2-3 sentences)
- UUX Components table
- Acceptance Criteria checklist

### 4. Architecture Overview

Full content from `spec-technical.md → Architecture Overview`

Include ASCII diagram as code block with monospace font.

Embed architecture diagrams (`*-arch-*.mmd`) as images.

### 5. File Structure

Code block from `spec-technical.md → File Structure`

```
src/features/cards/
├── components/
│   ├── cards-page.ts
│   └── ...
```

### 6. Type Definitions

Full TypeScript code blocks from `spec-technical.md → Type Definitions`

Syntax highlighting via monospace font with proper indentation.

### 7. API Specification

**Endpoints Table:**

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|

**Sample Data:**

JSON code blocks for request/response examples.

### 8. Component Specifications

For each component:
- Component name (H3)
- Purpose
- Properties table
- Styling notes
- Code examples (if any)

### 9. State Management

- Context definition code
- Provider methods
- State flow description

### 10. Non-Functional Requirements

**Performance:**

| Metric | Target | Measurement |
|--------|--------|-------------|

**Accessibility (WCAG 2.2 AA):**

| Requirement | Implementation |
|-------------|----------------|

**Browser Support:**

| Browser | Version |
|---------|---------|

### 11. Security

**Data Handling:**

| Data | Handling | Notes |
|------|----------|-------|

**API Security:**

| Protection | Implementation |
|------------|----------------|

### 12. Error Handling

**Error States:**

| Error | User Message | Recovery |
|-------|--------------|----------|

**Error Component:**

Code block example.

### 13. Testing Strategy

**Unit Tests:**

| Component | Test Cases |
|-----------|------------|

**Integration Tests:**

| Flow | Validation |
|------|------------|

**Accessibility Tests:**

Code example using axe-core.

### 14. Dependencies

**Runtime:**

| Package | Version | Purpose |
|---------|---------|---------|

**Development:**

| Package | Purpose |
|---------|---------|

### 15. Implementation Checklist

Phased checklist from spec:

**Phase 1: Foundation**
- [ ] Task 1
- [ ] Task 2

**Phase 2: State & Context**
- [ ] Task 1

### 16. Technical Acceptance Criteria

Full checklist from `spec-technical.md → Technical Acceptance Criteria`

### 17. Appendix: All Diagrams

Embed all Mermaid diagrams from `_artifacts/diagrams/`:
- Architecture diagrams
- Data flow diagrams
- Component hierarchy
- State machines

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
| Code | Courier New | 10pt |
| Table | Arial | 10pt |

### Colors

| Element | Hex |
|---------|-----|
| Heading 1 | `1A1F71` |
| Heading 2 | `2E77BB` |
| Code Block BG | `F1F5F9` |
| Code Text | `1E293B` |
| Table Header BG | `1A1F71` |
| Table Header Text | `FFFFFF` |

### Code Block Styling

```javascript
function createCodeBlock(code, language = 'typescript') {
  return new Table({
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 200, right: 200 },
            children: code.split('\n').map(line =>
              new Paragraph({
                children: [new TextRun({
                  text: line,
                  font: 'Courier New',
                  size: 20, // 10pt
                })],
              })
            ),
          }),
        ],
      }),
    ],
  });
}
```

---

## docx-js Implementation

```javascript
const { Document, Packer, Paragraph, TextRun, HeadingLevel,
        Table, TableRow, TableCell, WidthType, ShadingType,
        TableOfContents, PageBreak, ImageRun } = require('docx');

async function generateTechnicalDoc(extracted, outputPath) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22 },
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
        {
          id: 'Code',
          name: 'Code',
          basedOn: 'Normal',
          run: { font: 'Courier New', size: 20 },
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
        ...createTitlePage(extracted.metadata, 'Technical Specification'),

        new Paragraph({ children: [new PageBreak()] }),

        // TOC
        new TableOfContents('Table of Contents', {
          hyperlink: true,
          headingStyleRange: '1-3',
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Sections
        ...createFeatureContext(extracted),
        ...createArchitecture(extracted.architecture, extracted.diagrams),
        ...createFileStructure(extracted.fileStructure),
        ...createTypeDefinitions(extracted.types),
        ...createAPISpecification(extracted.api),
        ...createComponentSpecs(extracted.components),
        ...createStateManagement(extracted.stateManagement),
        ...createNFR(extracted.nfr),
        ...createSecurity(extracted.security),
        ...createErrorHandling(extracted.errorHandling),
        ...createTestingStrategy(extracted.testing),
        ...createDependencies(extracted.dependencies),
        ...createImplementationChecklist(extracted.checklist),
        ...createTechnicalAC(extracted.technicalAC),
        ...createDiagramAppendix(extracted.diagrams),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
}

function createArchitecture(content, diagrams) {
  const sections = [
    new Paragraph({
      text: 'Architecture Overview',
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  // Add ASCII diagram as code block
  if (content.includes('```')) {
    const codeMatch = content.match(/```[\s\S]*?```/);
    if (codeMatch) {
      const code = codeMatch[0].replace(/```/g, '').trim();
      sections.push(createCodeBlock(code, 'text'));
    }
  }

  // Add description
  const description = content.replace(/```[\s\S]*?```/, '').trim();
  if (description) {
    sections.push(new Paragraph({ text: description }));
  }

  // Add architecture diagrams
  const archDiagrams = diagrams.filter(d =>
    d.name.includes('arch') || d.name.includes('component')
  );

  archDiagrams.forEach(diagram => {
    sections.push(embedDiagram(diagram));
  });

  return sections;
}

function createTypeDefinitions(types) {
  return [
    new Paragraph({
      text: 'Type Definitions',
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: 'TypeScript interfaces and types for this feature:',
    }),
    createCodeBlock(types, 'typescript'),
  ];
}

function createAPISpecification(api) {
  const sections = [
    new Paragraph({
      text: 'API Specification',
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  // Endpoints table
  if (api.endpoints) {
    sections.push(
      new Paragraph({
        text: 'Endpoints',
        heading: HeadingLevel.HEADING_2,
      }),
      createTable(
        ['Endpoint', 'Method', 'Request', 'Response'],
        api.endpoints.map(e => [e.endpoint, e.method, e.request, e.response])
      )
    );
  }

  // Sample data
  if (api.sampleData) {
    sections.push(
      new Paragraph({
        text: 'Sample Data',
        heading: HeadingLevel.HEADING_2,
      }),
      createCodeBlock(JSON.stringify(api.sampleData, null, 2), 'json')
    );
  }

  return sections;
}
```

---

## Diagram Handling

For technical documents, include ALL diagrams:

```javascript
function createDiagramAppendix(diagrams) {
  const sections = [
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      text: 'Appendix: Diagrams',
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  diagrams.forEach(diagram => {
    sections.push(
      new Paragraph({
        text: formatDiagramName(diagram.name),
        heading: HeadingLevel.HEADING_2,
      }),
      embedDiagram(diagram)
    );
  });

  return sections;
}

function formatDiagramName(filename) {
  // Convert 'component-hierarchy.mmd' to 'Component Hierarchy'
  return filename
    .replace('.mmd', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

---

## Code Syntax Highlighting

Since Word doesn't support true syntax highlighting, use consistent formatting:

- Keywords: Bold
- Strings: Regular
- Comments: Italic, gray
- Types: Regular

For simplicity, render all code in monospace without highlighting:

```javascript
function createCodeBlock(code, language) {
  const lines = code.split('\n');

  return new Table({
    columnWidths: [9360],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            margins: { top: 150, bottom: 150, left: 200, right: 200 },
            children: lines.map(line =>
              new Paragraph({
                children: [new TextRun({
                  text: line || ' ', // Preserve empty lines
                  font: 'Courier New',
                  size: 20,
                })],
                spacing: { after: 0 },
              })
            ),
          }),
        ],
      }),
    ],
  });
}
```

---

## Output Validation

Before saving, verify:
- [ ] All sections present
- [ ] Code blocks render in monospace
- [ ] Tables properly formatted
- [ ] All diagrams embedded
- [ ] TOC generates correctly
- [ ] Page breaks logical

---

## File Output

Save to: `.temn/specs/{feature}/_artifacts/spec-technical.docx`
