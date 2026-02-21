# WCAG 2.2 AA Accessibility Standards

## Overview

This document provides a comprehensive checklist for **WCAG 2.2 Level AA** compliance - the minimum standard for accessible web applications.

---

## Four Principles (POUR)

### 1. Perceivable

Information and UI components must be presentable in ways users can perceive.

#### 1.1 Text Alternatives
- [ ] **All images have alt text** - Descriptive text for informative images
- [ ] **Decorative images have empty alt** - `alt=""` for decorative images
- [ ] **Complex images have long descriptions** - Charts, diagrams, infographics
- [ ] **Icons with meaning have labels** - Icon buttons need accessible names

#### 1.2 Time-Based Media
- [ ] **Video has captions** - Synchronized captions for deaf/hard of hearing
- [ ] **Audio has transcripts** - Text alternatives for audio content
- [ ] **Video has audio descriptions** - Descriptions of visual content for blind users

#### 1.3 Adaptable
- [ ] **Content can be presented differently** - Without losing information
- [ ] **Logical reading order** - Makes sense when CSS is disabled
- [ ] **Don't rely on sensory characteristics** - Shape, color, size, location
- [ ] **Orientation not restricted** - Works in portrait and landscape

#### 1.4 Distinguishable
- [ ] **Color contrast: 4.5:1** - Normal text (under 18px)
- [ ] **Color contrast: 3:1** - Large text (18px+ or 14px bold)
- [ ] **UI component contrast: 3:1** - Buttons, inputs, icons
- [ ] **Don't use color alone** - Use icons, patterns, text too
- [ ] **Text can be resized to 200%** - Without loss of functionality
- [ ] **Images of text avoided** - Use real text when possible
- [ ] **Reflow at 320px width** - No horizontal scrolling
- [ ] **Text spacing adjustable** - Users can modify spacing
- [ ] **Content on hover/focus visible** - Tooltips, dropdowns

---

### 2. Operable

UI components and navigation must be operable.

#### 2.1 Keyboard Accessible
- [ ] **All functionality keyboard accessible** - No mouse required
- [ ] **No keyboard traps** - Can tab out of all components
- [ ] **Skip links provided** - Bypass repeated content
- [ ] **Focus visible** - Clear focus indicator (2px minimum)

#### 2.2 Enough Time
- [ ] **Timing adjustable** - Extend, turn off, or adjust time limits
- [ ] **Pause, stop, hide moving content** - Auto-playing media
- [ ] **No time-based interactions** - Unless essential
- [ ] **Session timeouts warned** - At least 20 seconds notice

#### 2.3 Seizures and Physical Reactions
- [ ] **No flashing content** - Nothing flashes more than 3 times/second
- [ ] **Motion can be disabled** - Respect prefers-reduced-motion

#### 2.4 Navigable
- [ ] **Bypass blocks available** - Skip navigation links
- [ ] **Page titles descriptive** - Unique and informative
- [ ] **Focus order logical** - Follows visual/reading order
- [ ] **Link purpose clear** - From link text alone or context
- [ ] **Multiple ways to find pages** - Search, sitemap, navigation
- [ ] **Headings and labels descriptive** - Clear and informative
- [ ] **Focus visible** - Always visible focus indicator

#### 2.5 Input Modalities
- [ ] **Target size: 24x24px minimum** - For pointer inputs
- [ ] **Pointer gestures have alternatives** - Simple clicks available
- [ ] **Motion actuation alternatives** - Don't require shaking/tilting
- [ ] **Dragging alternatives** - Provide click alternatives

---

### 3. Understandable

Information and UI operation must be understandable.

#### 3.1 Readable
- [ ] **Language of page identified** - `lang` attribute on html
- [ ] **Language of parts identified** - `lang` attribute on foreign text
- [ ] **Unusual words explained** - Glossary or inline definitions
- [ ] **Abbreviations expanded** - First use or glossary

#### 3.2 Predictable
- [ ] **No unexpected context changes on focus** - Don't auto-submit
- [ ] **No unexpected context changes on input** - Warn before changes
- [ ] **Navigation consistent** - Same order across pages
- [ ] **Components consistent** - Same functionality, same name

#### 3.3 Input Assistance
- [ ] **Errors identified** - Clear error messages
- [ ] **Labels or instructions provided** - For user input
- [ ] **Error suggestions provided** - How to fix the error
- [ ] **Error prevention for legal/financial** - Review before submit
- [ ] **Redundant entry avoided** - Don't ask for same info twice

---

### 4. Robust

Content must be robust enough for assistive technologies.

#### 4.1 Compatible
- [ ] **Valid HTML** - Proper syntax, nested correctly
- [ ] **Name, role, value programmatic** - ARIA when needed
- [ ] **Status messages announced** - Without focus change

---

## Quick Validation Checklist

### Keyboard Testing
```
1. Tab through entire page
2. Verify focus visible at all times
3. Activate all interactive elements with Enter/Space
4. Navigate dropdowns with arrow keys
5. Escape closes modals
6. Tab doesn't get trapped
```

### Screen Reader Testing
```
1. Page title announced on load
2. Headings form logical hierarchy (h1 → h2 → h3)
3. Links describe destination
4. Form fields have labels
5. Errors announced when they appear
6. Dynamic content announced (live regions)
```

### Visual Testing
```
1. Zoom to 200% - content still readable
2. High contrast mode - content visible
3. Color blindness simulation - info not lost
4. 320px viewport - no horizontal scroll
```

---

## Common Failures

### ❌ Missing Alt Text
```html
<!-- Wrong -->
<img src="chart.png">

<!-- Correct -->
<img src="chart.png" alt="Bar chart showing Q4 revenue increased 15%">

<!-- Decorative -->
<img src="decorative-line.png" alt="">
```

### ❌ Insufficient Contrast
```css
/* Wrong - 2.5:1 ratio */
color: #767676;
background: #ffffff;

/* Correct - 4.5:1 ratio */
color: #595959;
background: #ffffff;
```

### ❌ Missing Form Labels
```html
<!-- Wrong -->
<input type="email" placeholder="Email">

<!-- Correct -->
<label for="email">Email</label>
<input type="email" id="email">

<!-- Or with aria-label -->
<input type="email" aria-label="Email address">
```

### ❌ Focus Not Visible
```css
/* Wrong */
*:focus { outline: none; }

/* Correct */
*:focus {
  outline: 2px solid #4A5798;
  outline-offset: 2px;
}
```

### ❌ Color Alone Conveys Meaning
```html
<!-- Wrong - only color indicates error -->
<input style="border-color: red">

<!-- Correct - color + icon + text -->
<input aria-describedby="error-msg" aria-invalid="true">
<span id="error-msg">⚠️ Email is required</span>
```

---

## Testing Tools

### Automated Testing
- **axe DevTools** - Browser extension for automated audits
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Chrome DevTools accessibility audit
- **Pa11y** - Command-line accessibility testing

### Manual Testing
- **Keyboard only** - Navigate entire app without mouse
- **Screen readers** - VoiceOver (Mac), NVDA (Windows), TalkBack (Android)
- **Color contrast** - WebAIM Contrast Checker
- **Zoom** - Browser zoom to 200%

### Simulators
- **Color blindness** - Stark, Colorblind Web Page Filter
- **Low vision** - NoCoffee browser extension
- **Reduced motion** - Browser prefers-reduced-motion setting

---

## Resources

- [WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM Articles](https://webaim.org/articles/)
