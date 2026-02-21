# Temenos UUX Design System - Accessibility

## Overview

The UUX web components are designed and built with accessibility in mind, aiming to provide **Web Content Accessibility Guidelines (WCAG) 2.2 AA compliant** building blocks for application development.

**Commitment:** All components and design patterns in the UUX design system target WCAG 2.2 AA compliance as a minimum standard.

---

## WCAG 2.2 AA Compliance

The UUX design system follows the [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) at Level AA, which includes:

### Key Success Criteria

1. **Perceivable** - Information and UI components must be presentable to users in ways they can perceive
2. **Operable** - UI components and navigation must be operable
3. **Understandable** - Information and operation of UI must be understandable
4. **Robust** - Content must be robust enough to be interpreted by assistive technologies

---

## Color Contrast

All color combinations in the UUX design system meet WCAG 2.2 AA contrast requirements.

### Contrast Requirements

**Standard Text (< 18px or < 14px bold):**
- **Minimum ratio:** 4.5:1 against background

**Large Text (≥ 18px or ≥ 14px bold):**
- **Minimum ratio:** 3:1 against background

**Non-text Elements (UI components, graphics):**
- **Minimum ratio:** 3:1 against adjacent colors

### Validated Color Combinations

The following text/background combinations are WCAG 2.2 AA compliant:

#### On White Background (#FFFFFF)

| Text Color | Hex Code | Contrast Ratio | WCAG Level |
|------------|----------|----------------|------------|
| Gray Darkest | `#000000` | 21:1 | AAA |
| Gray Dark | `#3B3B3B` | 11.6:1 | AAA |
| Gray Primary | `#757575` | 4.6:1 | AA |
| Temenos Darkest | `#2C3361` | 10.8:1 | AAA |
| Temenos Dark | `#293276` | 9.7:1 | AAA |
| Temenos Primary | `#4A5798` | 5.8:1 | AA |
| Status Negative Primary | `#D32E2F` | 4.9:1 | AA |
| Status Positive Primary | `#707016` | 7.2:1 | AAA |
| Status Notice Primary | `#CC7E0B` | 5.4:1 | AA |

#### Status Colors on Light Backgrounds

| Combination | Contrast Ratio | Pass |
|-------------|----------------|------|
| Error text (`#D32E2F`) on white | 4.9:1 | ✓ AA |
| Success text (`#707016`) on white | 7.2:1 | ✓ AAA |
| Warning text (`#CC7E0B`) on white | 5.4:1 | ✓ AA |

### Contrast Checking

**Rule - Always verify contrast:**
- Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Test custom color combinations before implementation
- Ensure interactive elements meet 3:1 minimum
- Verify all text meets appropriate ratio (4.5:1 or 3:1)

**Reference:** [WCAG 2.2, 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)

---

## Keyboard Accessibility

All interactive components must be fully operable via keyboard.

### Requirements

1. **Tab Navigation** - All interactive elements accessible via Tab key
2. **Focus Indicators** - Visible 2px outline in `brand-primary` color
3. **Logical Tab Order** - Follow visual flow (left-to-right, top-to-bottom in LTR)
4. **Keyboard Shortcuts** - Support standard shortcuts (Space, Enter, Arrow keys)
5. **No Keyboard Traps** - Users can navigate away from all elements

### Key Bindings

| Component | Key | Action |
|-----------|-----|--------|
| **Button** | Enter / Space | Activate button |
| **Checkbox** | Space | Toggle checked state |
| **Radio Button** | Arrow keys | Navigate between options |
| **Radio Button** | Space | Select option |
| **Dropdown** | Enter / Space | Open dropdown |
| **Dropdown** | Arrow keys | Navigate options |
| **Dropdown** | Escape | Close dropdown |
| **Text Field** | Tab | Move to next field |
| **Dialog** | Escape | Close dialog |

### Focus Management

**Guidelines:**
- Focus indicator must always be visible (never `outline: none` without replacement)
- Focus order should match visual order
- When opening dialogs/modals, move focus to first focusable element
- When closing dialogs, return focus to triggering element
- Skip links for keyboard users to jump to main content

---

## Screen Reader Support

The UUX design system is tested with leading screen reader technologies:

### Tested Screen Readers

| Screen Reader | Version | Platform | Status |
|--------------|---------|----------|--------|
| **JAWS** | 2019+ | Windows 10 | ✓ Completed |
| **NVDA** | 2019+ | Windows 10 | ✓ Completed |
| **VoiceOver** | Latest | macOS / iOS | In Progress |
| **TalkBack** | Latest | Android | In Progress |

### ARIA Support

Components use appropriate ARIA attributes:

**Common ARIA Attributes:**
- `aria-label` - Accessible name for elements
- `aria-labelledby` - Reference to labeling element
- `aria-describedby` - Additional descriptive information
- `aria-invalid` - Indicates validation error
- `aria-required` - Indicates required field
- `aria-disabled` - Indicates disabled state
- `aria-expanded` - Indicates expanded/collapsed state
- `aria-hidden` - Hides decorative elements from screen readers

### Semantic HTML

**Best Practices:**
- Use semantic HTML elements (`<button>`, `<input>`, `<label>`, etc.)
- Use proper heading hierarchy (`<h1>` to `<h6>`)
- Use `<fieldset>` and `<legend>` for form grouping
- Use `<nav>` for navigation regions
- Use `<main>` for main content area
- Associate labels with inputs via `for` and `id` attributes

---

## Touch Target Size

All interactive elements must have adequate size for touch interaction.

### Requirements

**Minimum Touch Target Size:**
- **40px × 40px** - Minimum for all interactive elements
- **48px × 48px** - Recommended (provides better usability)

**Spacing Between Targets:**
- Minimum **8px (1G)** spacing between touch targets

### Component Compliance

| Component | Standard Density | Compact Density | Compliant |
|-----------|-----------------|-----------------|-----------|
| Text Field | 56px height | 40px height | ✓ |
| Button (CTA) | 48px × 48px min | 40px × 40px min | ✓ |
| Radio Button | 40px height | 32px height | ✓* |
| Checkbox | 40px height | 32px height | ✓* |

\* Touch target includes the label, ensuring adequate size

---

## Visual Accessibility

### Text Legibility

**Requirements:**
- Minimum text size: 12px (11px absolute minimum)
- Line height: At least 1.5× font size for body text
- Paragraph spacing: At least 1.5× line height
- Letter spacing: At least 0.12× font size
- Word spacing: At least 0.16× font size

**Text Resizing:**
- Text must be readable when zoomed to 200%
- Layout should not break when text is resized
- No horizontal scrolling at 200% zoom

### Content Reflow

At 400% zoom (320px viewport):
- Content should reflow to single column
- No horizontal scrolling required
- All content remains readable
- No loss of information or functionality

### High Contrast Mode

**In Progress:** Components are being tested and optimized for Windows High Contrast Mode.

**Requirements:**
- All UI components visible in high contrast
- Borders and outlines clearly defined
- Focus indicators remain visible
- Custom colors respect user preferences

---

## Testing Methodology

The Temenos UUX team conducts comprehensive accessibility testing:

### Automated Testing

| Test | Tool | Platform | Status | Method |
|------|------|----------|--------|--------|
| 1 | Keyboard | Windows 10 | ✓ Completed | Automated (partial) |
| 2 | Keyboard | macOS 10.14.4 | Pending | Manual |
| 3 | AXE | v4.5.3+ | ✓ Completed | Automated |
| 4 | WAVE | v3.0.5 | ✓ Completed | Manual |
| 5 | WAVE CSS Off | - | ✓ Completed | Manual |

### Manual Testing

| Test | Tool | Platform | Status |
|------|------|----------|--------|
| 6 | Color Contrast Analyser | Windows 10 | ✓ Completed |
| 7 | Manual Review | - | ✓ Completed |
| 8 | Zoom 200% | Windows 10 | ✓ Completed |
| 9 | Reflow 400% | Windows 10 | ✓ Completed |
| 10 | JAWS (In-Context) | Windows 10 | ✓ Completed |
| 11 | JAWS (Out-of-Context) | Windows 10 | ✓ Completed |
| 12 | NVDA | Windows 10 | ✓ Completed |
| 13 | High Contrast Mode | Windows 10 | In Progress |

### AXE Regression Testing

All UUX core components have automated AXE v4.7+ regression scripts that run as part of daily builds. These tests verify:
- HTML structure compliance
- Correct ARIA tag usage
- Color contrast ratios
- Keyboard accessibility
- Focus management

**Note:** The Temenos team maintains an internal accessibility dashboard tracking component compliance.

---

## Accessibility Best Practices

### For Designers

1. **Use sufficient contrast** - Always verify color combinations
2. **Design clear focus states** - Make keyboard navigation obvious
3. **Provide text alternatives** - Plan for alt text, labels, descriptions
4. **Avoid color-only indicators** - Use icons, text, or patterns too
5. **Design for flexibility** - Account for text resize, zoom, reflow
6. **Group related content** - Use visual and semantic grouping

### For Developers

1. **Use semantic HTML** - Choose appropriate HTML elements
2. **Add ARIA when needed** - Enhance accessibility of custom components
3. **Test with keyboard** - Verify all functionality works without mouse
4. **Test with screen readers** - Ensure content is announced correctly
5. **Maintain focus management** - Handle focus for dynamic content
6. **Validate automatically** - Use AXE or similar tools in build process
7. **Follow design tokens** - Use provided color combinations

### For Content Authors

1. **Write clear labels** - Use descriptive, concise labels
2. **Provide helpful errors** - Explain what's wrong and how to fix it
3. **Use plain language** - Avoid jargon and complex terms
4. **Structure content** - Use headings to organize information
5. **Add alt text** - Describe images meaningfully
6. **Caption videos** - Provide captions and transcripts

---

## Current Status

### Third-Party Audit

**Status:** The UUX web components have not yet been audited by a certified accessibility third party.

**Note:** While the team follows best practices and conducts thorough internal testing, formal certification is planned for future releases.

### Known Limitations

- High Contrast Mode support is still in progress
- Some components may require additional ARIA refinements
- Full audit pending third-party certification

### Continuous Improvement

The UUX design system is actively maintained with:
- Daily automated accessibility regression tests
- Regular manual testing with assistive technologies
- Ongoing refinements based on user feedback
- Updates to meet evolving WCAG standards

---

## Resources and Training

### Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [AXE DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Color Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

### References

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Digital Accessibility Centre](https://digitalaccessibilitycentre.org/)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)

### Training

The Temenos UUX team was trained by experts from the [Digital Accessibility Centre](https://digitalaccessibilitycentre.org/), ensuring best practices are followed throughout the design and development process.

---

## Reporting Accessibility Issues

If you encounter accessibility issues with UUX components:

1. **Document the issue** - Include component, browser, assistive technology
2. **Describe the problem** - What doesn't work? What's expected?
3. **Provide context** - WCAG success criterion violated (if known)
4. **Submit feedback** - Contact the UUX team or file internal issue

**Internal Resources:**
- UUX Accessibility Dashboard (Temenos employees only)
- UUX Accessibility Status page (Confluence - Temenos employees only)

---

## Commitment to Accessibility

Temenos is committed to making all UUX components and patterns accessible to everyone, regardless of ability. Accessibility is not an afterthought but a core principle integrated into every design and development decision.

**Goal:** Provide WCAG 2.2 AA compliant (or better) components that enable all users to complete their tasks efficiently and independently.
