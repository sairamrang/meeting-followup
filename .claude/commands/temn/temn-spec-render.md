---
description: "Render specification as HTML, Word, PowerPoint, or PDF for different audiences"
allowed-tools: ["Read", "Write", "Glob", "Bash"]
---

<!-- Claude 4 Best Practices Alignment -->

<investigate_before_answering>
Read spec files and scan artifacts before generating.
Do not assume content exists - verify file presence first.
</investigate_before_answering>

<use_parallel_tool_calls>
Read spec.yaml, spec-functional.md, spec-technical.md in parallel.
Scan diagrams and images directories in parallel.
</use_parallel_tool_calls>

<!-- End Claude 4 Best Practices -->

# Specification Renderer

Generate professional documents from specifications in multiple formats.

## Usage

```bash
# HTML (default - current behavior)
/temn:temn-spec-render [feature]
/temn:temn-spec-render [feature] --open

# Office Formats
/temn:temn-spec-render [feature] --format pptx                    # Executive deck
/temn:temn-spec-render [feature] --format docx --audience business # Business doc
/temn:temn-spec-render [feature] --format docx --audience technical # Technical doc
/temn:temn-spec-render [feature] --format pdf                      # Formal PDF
```

## Format-Audience Matrix

| Format | Default Audience | Use Case | Output File |
|--------|------------------|----------|-------------|
| `html` | all | Interactive review | `spec.html` |
| `pptx` | executive | Board presentations | `spec-executive.pptx` |
| `docx` | business | Product team reference | `spec-business.docx` |
| `docx` | technical | Developer handoff | `spec-technical.docx` |
| `pdf` | all | Formal sign-off | `spec.pdf` |

---

## Output by Audience

### Executive (PPTX - 8-10 slides)
- Business value and ROI
- Success metrics and KPIs
- High-level timeline
- Key risks and decisions

### Business (DOCX - ~12 pages)
- Complete functional requirements
- User stories and workflows
- Acceptance criteria
- API overview (table only)

### Technical (DOCX - ~18 pages)
- Architecture and file structure
- Type definitions and APIs
- Component specifications
- Testing strategy

### All (HTML/PDF)
- Complete specification
- All diagrams and images
- Interactive navigation (HTML)

---

## Process

### Step 1: Locate Spec

```
.temn/specs/{feature}/
├── spec.yaml              # Metadata (name, version, status, score)
├── spec-functional.md     # Functional requirements
├── spec-technical.md      # Technical requirements
└── _artifacts/
    ├── diagrams/          # *.mmd files
    └── images/            # *.png, *.jpg, *.gif
```

### Step 2: Gather Content

1. **Read metadata**: Parse `spec.yaml` for feature name, version, status, score
2. **Read specs**: Load `spec-functional.md` and `spec-technical.md`
3. **Scan diagrams**: Find all `*.mmd` files in `_artifacts/diagrams/`
4. **Scan images**: Find all image files in `_artifacts/images/`
5. **Detect Figma**: Search spec content for `figma.com` URLs

### Step 3: Extract for Audience

**Load extraction patterns:**
- `@.claude/agents/temn/_patterns/spec-office-export/audience-extractors.md`

Extract content based on `--audience` flag (or default for format).

### Step 4: Generate Output

**For HTML (default):**
- Load: `@.claude/agents/temn/_patterns/spec-design-guidelines.md`
- Load: `@.claude/agents/temn/_patterns/spec-viewer-template.tsx`
- Build: Use `spec-build-scripts/init-spec-viewer.sh` and `bundle-spec.sh`

**For PPTX:**
- Load: `@.claude/skills/pptx/SKILL.md`
- Load: `@.claude/agents/temn/_patterns/spec-office-export/executive-pptx.md`
- Generate: 8-10 slide deck using PptxGenJS patterns

**For DOCX:**
- Load: `@.claude/skills/docx/SKILL.md`
- Load: `@.claude/agents/temn/_patterns/spec-office-export/business-docx.md` (or technical-docx.md)
- Generate: Professional Word document using docx-js patterns

**For PDF:**
- Load: `@.claude/skills/pdf/SKILL.md`
- Generate: Formal PDF with cover page and TOC

### Step 5: Output

```
.temn/specs/{feature}/_artifacts/
├── spec.html              # HTML (default)
├── spec-executive.pptx    # Executive presentation
├── spec-business.docx     # Business requirements
├── spec-technical.docx    # Technical specification
└── spec.pdf               # Formal PDF
```

---

## Examples

### Default HTML Generation

```bash
/temn:temn-spec-render 16-cards-management
```

**Output:**
```
Rendering spec for: 16-cards-management
Format: html | Audience: all

Found:
- spec.yaml (v1.0, Ready for Development, 8.8/10)
- spec-functional.md (308 lines)
- spec-technical.md (413 lines)
- 4 diagrams
- 0 images

Building HTML...
Created: .temn/specs/16-cards-management/_artifacts/spec.html (156KB)
```

### Executive Presentation

```bash
/temn:temn-spec-render 16-cards-management --format pptx
```

**Output:**
```
Rendering spec for: 16-cards-management
Format: pptx | Audience: executive

Extracting executive content...
- Title: Cards Management
- Status: Ready for Development
- Score: 8.8/10
- Business value: 4 points
- Success metrics: 5 KPIs

Generating PowerPoint...
Created: .temn/specs/16-cards-management/_artifacts/spec-executive.pptx (8 slides)
```

### Business Requirements Document

```bash
/temn:temn-spec-render 16-cards-management --format docx --audience business
```

**Output:**
```
Rendering spec for: 16-cards-management
Format: docx | Audience: business

Extracting business content...
- Sections: 12
- Tables: 8
- Diagrams: 2 (workflow, journey)

Generating Word document...
Created: .temn/specs/16-cards-management/_artifacts/spec-business.docx (~14 pages)
```

### Technical Specification

```bash
/temn:temn-spec-render 16-cards-management --format docx --audience technical
```

**Output:**
```
Rendering spec for: 16-cards-management
Format: docx | Audience: technical

Extracting technical content...
- Architecture diagram included
- 4 code blocks
- API endpoints: 4
- Components: 5

Generating Word document...
Created: .temn/specs/16-cards-management/_artifacts/spec-technical.docx (~18 pages)
```

### Formal PDF

```bash
/temn:temn-spec-render 16-cards-management --format pdf
```

**Output:**
```
Rendering spec for: 16-cards-management
Format: pdf | Audience: all

Generating PDF with cover page...
Created: .temn/specs/16-cards-management/_artifacts/spec.pdf (24 pages)
```

---

## Error Handling

| Error | Resolution |
|-------|------------|
| Feature not found | List available features |
| No spec.yaml | Use defaults (name from folder, v1.0, Draft) |
| No functional spec | Show error - required file |
| No diagrams/images | Generate without those sections |
| PPTX generation fails | Check pptxgenjs is installed |
| DOCX generation fails | Check docx package is installed |
| Mermaid conversion fails | Skip diagram, show warning |

---

## Prerequisites

Dependencies installed on first use:

**For HTML:**
- Node.js (18+)
- React, Tailwind, Parcel, mermaid

**For PPTX/DOCX/PDF:**
```bash
npm install docx pptxgenjs pdf-lib @mermaid-js/mermaid-cli
```

---

## Skills Referenced

This command uses patterns from:
- `.claude/skills/docx/` - Word document generation
- `.claude/skills/pptx/` - PowerPoint generation
- `.claude/skills/pdf/` - PDF generation

---

## Related Commands

| Command | Use |
|---------|-----|
| `/temn:temn-requirements` | Create functional spec |
| `/temn:temn-tech-spec` | Create technical spec |
| `/temn:temn-diagram` | Add diagrams to `_artifacts/diagrams/` |
