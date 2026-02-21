# Executive PPTX Pattern

Generate an 8-10 slide executive presentation from specification content.

## Slide Structure

### Slide 1: Title
```
┌────────────────────────────────────────────┐
│                                            │
│           [FEATURE NAME]                   │
│              (large)                       │
│                                            │
│        Feature Specification               │
│            (subtitle)                      │
│                                            │
│  ┌─────────────────┐                       │
│  │ Ready for Dev   │  Score: 8.8/10        │
│  └─────────────────┘                       │
│                                            │
│              January 2025                  │
└────────────────────────────────────────────┘
```

**Content Source:**
- Title: `spec.yaml → feature.name`
- Status badge: `spec.yaml → feature.status`
- Score: `spec.yaml → quality.overall_score`
- Date: Current date or `spec.yaml → last_updated`

### Slide 2: The Problem
```
┌────────────────────────────────────────────┐
│ The Problem                                │
├────────────────────────────────────────────┤
│                                            │
│ [First paragraph from Overview section]    │
│                                            │
│ Current Challenges:                        │
│ • Pain point 1                             │
│ • Pain point 2                             │
│ • Pain point 3                             │
│                                            │
│ Impact: [Key metric if available]          │
│                                            │
└────────────────────────────────────────────┘
```

**Content Source:**
- Main text: `spec-functional.md → Overview → first paragraph`
- Bullets: Inferred from context or Business Value (inverse)

### Slide 3: Our Solution
```
┌────────────────────────────────────────────┐
│ Our Solution                               │
├────────────────────────────────────────────┤
│                                            │
│ [Feature overview - 2-3 sentences]         │
│                                            │
│ Key Capabilities:                          │
│ • P0 Feature 1 name                        │
│ • P0 Feature 2 name                        │
│ • P0 Feature 3 name                        │
│ • P0 Feature 4 name                        │
│                                            │
└────────────────────────────────────────────┘
```

**Content Source:**
- Overview: `spec-functional.md → Overview → after Business Value`
- Capabilities: `spec-functional.md → Features → P0 names only`

### Slide 4: Business Value
```
┌────────────────────────────────────────────┐
│ Business Value                             │
├────────────────────────────────────────────┤
│                                            │
│ For Customers:             For Business:   │
│ • Self-service...          • 50% fewer     │
│ • Instant...                 support calls │
│ • Mobile-first...          • Increased     │
│                              engagement    │
│                                            │
│     ┌──────────────────────────────┐       │
│     │  Target: 60% adoption        │       │
│     └──────────────────────────────┘       │
│                                            │
└────────────────────────────────────────────┘
```

**Content Source:**
- Bullets: `spec-functional.md → Business Value`
- Split into customer-facing vs business benefits

### Slide 5: Success Metrics
```
┌────────────────────────────────────────────┐
│ Success Metrics                            │
├────────────────────────────────────────────┤
│                                            │
│  ┌─────────────┬──────────┬────────────┐   │
│  │ Metric      │ Target   │ Baseline   │   │
│  ├─────────────┼──────────┼────────────┤   │
│  │ Adoption    │ 60%      │ N/A        │   │
│  │ Block Time  │ <30s     │ 5+ min     │   │
│  │ Support     │ -50%     │ Baseline   │   │
│  │ Satisfaction│ 4.2/5    │ 3.8/5      │   │
│  └─────────────┴──────────┴────────────┘   │
│                                            │
└────────────────────────────────────────────┘
```

**Content Source:**
- Table: `spec-functional.md → Success Metrics`

### Slide 6: User Experience
```
┌────────────────────────────────────────────┐
│ User Experience                            │
├────────────────────────────────────────────┤
│                                            │
│  Who Benefits:                             │
│  [Target Users description]                │
│                                            │
│  Key Workflow:                             │
│  [First workflow from User Workflows]      │
│                                            │
│  [Optional: 1 mockup image if available]   │
│                                            │
└────────────────────────────────────────────┘
```

**Content Source:**
- Users: `spec-functional.md → Target Users`
- Workflow: `spec-functional.md → User Workflows → first workflow`
- Image: `_artifacts/images/ → first mockup`

### Slide 7: Timeline & Progress
```
┌────────────────────────────────────────────┐
│ Implementation Timeline                    │
├────────────────────────────────────────────┤
│                                            │
│  Phase 1: Foundation        ████████░░ 80% │
│  Phase 2: State & Context   ██████░░░░ 60% │
│  Phase 3: Components        ████░░░░░░ 40% │
│  Phase 4: Integration       ██░░░░░░░░ 20% │
│  Phase 5: Polish            ░░░░░░░░░░  0% │
│                                            │
│  Overall Quality Score: 8.8/10             │
│                                            │
└────────────────────────────────────────────┘
```

**Content Source:**
- Phases: `spec-technical.md → Implementation Checklist → phase headers`
- Score: `spec.yaml → quality.overall_score`

### Slide 8: Next Steps
```
┌────────────────────────────────────────────┐
│ Next Steps                                 │
├────────────────────────────────────────────┤
│                                            │
│ Immediate Actions:                         │
│ • [Based on status - if Draft: finalize]   │
│ • [If Ready: begin development]            │
│ • [If In Progress: continue implementation]│
│                                            │
│ Key Dependencies:                          │
│ • [From spec.yaml → dependencies]          │
│                                            │
│ Questions/Decisions Needed:                │
│ • [If any open items from spec]            │
│                                            │
└────────────────────────────────────────────┘
```

**Content Source:**
- Status-based: `spec.yaml → feature.status`
- Dependencies: `spec.yaml → dependencies`

---

## Color Palette

Use professional corporate colors:

| Element | Color | Hex |
|---------|-------|-----|
| Primary (headers) | Corporate Blue | `1A1F71` |
| Secondary | Light Blue | `2E77BB` |
| Accent | Orange | `F79E1B` |
| Success | Green | `10B981` |
| Warning | Amber | `F59E0B` |
| Text | Dark Gray | `1E293B` |
| Muted | Gray | `64748B` |
| Background | Off-white | `F8FAFC` |

**CRITICAL**: In PptxGenJS, never use `#` prefix with colors.

---

## Typography

| Element | Font | Size |
|---------|------|------|
| Slide Title | Arial Bold | 28-32pt |
| Section Header | Arial Bold | 24pt |
| Body Text | Arial | 18-20pt |
| Table Text | Arial | 14-16pt |
| Footer/Metadata | Arial | 12pt |

---

## PptxGenJS Implementation

```javascript
const pptxgen = require('pptxgenjs');

function generateExecutiveDeck(extracted, outputPath) {
  const pres = new pptxgen();

  // Metadata
  pres.author = 'Product Team';
  pres.title = extracted.title;
  pres.subject = 'Feature Specification';

  // Slide 1: Title
  addTitleSlide(pres, extracted);

  // Slide 2: Problem
  addProblemSlide(pres, extracted.problem);

  // Slide 3: Solution
  addSolutionSlide(pres, extracted.solution, extracted.features);

  // Slide 4: Business Value
  addBusinessValueSlide(pres, extracted.businessValue);

  // Slide 5: Metrics
  addMetricsSlide(pres, extracted.metrics);

  // Slide 6: User Experience
  addUserExperienceSlide(pres, extracted.users, extracted.keyWorkflow);

  // Slide 7: Timeline
  addTimelineSlide(pres, extracted.phases, extracted.score);

  // Slide 8: Next Steps
  addNextStepsSlide(pres, extracted.status, extracted.dependencies);

  // Save
  return pres.writeFile({ fileName: outputPath });
}

function addTitleSlide(pres, data) {
  const slide = pres.addSlide();

  // Header bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.2,
    fill: { color: '1A1F71' },
  });

  // Title
  slide.addText(data.title, {
    x: 0.5, y: 1.8, w: 9, h: 1,
    fontSize: 44, bold: true, color: '1A1F71',
    align: 'center',
  });

  // Subtitle
  slide.addText('Feature Specification', {
    x: 0.5, y: 2.9, w: 9, h: 0.5,
    fontSize: 24, color: '64748B',
    align: 'center',
  });

  // Status badge
  const statusColor = data.status.includes('Ready') ? '10B981' :
                      data.status.includes('Draft') ? 'F59E0B' : '3B82F6';
  slide.addText(data.status, {
    x: 3.5, y: 3.8, w: 3, h: 0.4,
    fontSize: 14, color: 'FFFFFF', bold: true,
    fill: { color: statusColor },
    align: 'center',
  });

  // Score
  slide.addText(`Quality Score: ${data.score}/10`, {
    x: 0.5, y: 4.5, w: 9, h: 0.3,
    fontSize: 16, color: '64748B',
    align: 'center',
  });
}
```

---

## Diagram Handling

For executive presentations, include only high-level diagrams:

1. Convert Mermaid to PNG using mermaid-cli
2. Filter for `*-exec-*` or `*-overview-*` patterns
3. Scale to fit slide (max width 8", maintain aspect ratio)
4. Add as image with caption

```javascript
// Convert diagram before embedding
const { execSync } = require('child_process');
execSync(`npx mmdc -i ${diagramPath} -o ${pngPath} -w 800`);

// Add to slide
slide.addImage({
  path: pngPath,
  x: 1, y: 1.5, w: 8, h: 4,
});
```

---

## Output Validation

Before saving, verify:
- [ ] All 8 slides generated
- [ ] No empty content sections
- [ ] Colors render correctly (no `#` prefix)
- [ ] Text fits within slide bounds
- [ ] Tables are readable

---

## File Output

Save to: `.temn/specs/{feature}/_artifacts/spec-executive.pptx`
