# Accessibility Standards

**Owner:** Temenos UX Team
**Version:** 1.0
**Last Updated:** 2025-01-11

---

## Purpose

This document defines accessibility standards to ensure all Temenos products are usable by people with disabilities, meeting WCAG 2.2 Level AA compliance.

---

## Compliance Target

**Standard:** WCAG 2.2 Level AA
**Scope:** All user-facing applications (web, mobile, desktop)
**Verification:** Automated testing + manual audit before release

---

## WCAG 2.2 Principles

### 1. Perceivable
Information and user interface components must be presentable to users in ways they can perceive.

### 2. Operable
User interface components and navigation must be operable.

### 3. Understandable
Information and the operation of the user interface must be understandable.

### 4. Robust
Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

---

## WCAG 2.2 Level AA Requirements

### Perceivable

#### 1.1 Text Alternatives
- **1.1.1 Non-text Content (A):** All images, icons, and graphics have alt text
  ```html
  <img src="chart.png" alt="Revenue growth chart showing 25% increase in Q4">
  <uwc-icon name="info" aria-label="Information"></uwc-icon>
  ```

#### 1.2 Time-based Media
- **1.2.4 Captions (AA):** Provide captions for all prerecorded audio/video
- **1.2.5 Audio Description (AA):** Provide audio descriptions for prerecorded video

#### 1.3 Adaptable
- **1.3.1 Info and Relationships (A):** Use semantic HTML (headings, lists, tables)
  ```html
  <h1>Page Title</h1>
  <h2>Section Title</h2>
  <ul>
    <li>List item</li>
  </ul>
  ```
- **1.3.4 Orientation (AA):** Don't restrict to portrait/landscape only
- **1.3.5 Identify Input Purpose (AA):** Use autocomplete attributes
  ```html
  <input type="email" autocomplete="email" name="email">
  ```

#### 1.4 Distinguishable
- **1.4.3 Contrast Minimum (AA):** 4.5:1 for normal text, 3:1 for large text
- **1.4.4 Resize Text (AA):** Text can be resized up to 200% without loss of functionality
- **1.4.5 Images of Text (AA):** Avoid images of text (use actual text)
- **1.4.10 Reflow (AA):** Content reflows at 320px width (no horizontal scrolling)
- **1.4.11 Non-text Contrast (AA):** 3:1 contrast for UI components and graphical objects
- **1.4.12 Text Spacing (AA):** Support increased text spacing without loss of content
- **1.4.13 Content on Hover or Focus (AA):** Dismissible, hoverable, persistent tooltips/popovers

### Operable

#### 2.1 Keyboard Accessible
- **2.1.1 Keyboard (A):** All functionality available via keyboard
- **2.1.2 No Keyboard Trap (A):** Keyboard users can navigate away from components
- **2.1.4 Character Key Shortcuts (A):** Keyboard shortcuts can be turned off or remapped

#### 2.2 Enough Time
- **2.2.1 Timing Adjustable (A):** Users can turn off, adjust, or extend time limits
- **2.2.2 Pause, Stop, Hide (A):** Users can pause auto-updating content

#### 2.3 Seizures and Physical Reactions
- **2.3.1 Three Flashes or Below (A):** No content flashes more than 3 times per second

#### 2.4 Navigable
- **2.4.1 Bypass Blocks (A):** Provide skip links to main content
  ```html
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ```
- **2.4.2 Page Titled (A):** Each page has a descriptive title
- **2.4.3 Focus Order (A):** Focus order is logical and intuitive
- **2.4.4 Link Purpose (A):** Link text describes destination
  ```html
  <!-- Bad -->
  <a href="/report.pdf">Click here</a>

  <!-- Good -->
  <a href="/report.pdf">Download Q4 financial report (PDF, 2.4MB)</a>
  ```
- **2.4.5 Multiple Ways (AA):** Provide multiple ways to locate pages (navigation, search, sitemap)
- **2.4.6 Headings and Labels (AA):** Headings and labels are descriptive
- **2.4.7 Focus Visible (AA):** Keyboard focus indicator is visible
  ```css
  button:focus {
    outline: 2px solid var(--uwc-color-primary);
    outline-offset: 2px;
  }
  ```
- **2.4.11 Focus Not Obscured (Minimum) (AA):** Focused element is not completely hidden
- **2.4.13 Focus Appearance (AAA):** Focus indicator has minimum size and contrast (AAA, not required but recommended)

#### 2.5 Input Modalities
- **2.5.1 Pointer Gestures (A):** All functionality works with single-pointer actions
- **2.5.2 Pointer Cancellation (A):** Actions triggered on up-event (not down)
- **2.5.3 Label in Name (A):** Visible labels match accessible names
- **2.5.4 Motion Actuation (A):** Motion-triggered actions can be disabled
- **2.5.7 Dragging Movements (AA):** Alternatives to dragging (buttons, dropdowns)
- **2.5.8 Target Size (Minimum) (AA):** Touch targets are at least 24x24 CSS pixels

### Understandable

#### 3.1 Readable
- **3.1.1 Language of Page (A):** Page language declared
  ```html
  <html lang="en">
  ```
- **3.1.2 Language of Parts (AA):** Language changes identified
  ```html
  <p>The French word for cat is <span lang="fr">chat</span></p>
  ```

#### 3.2 Predictable
- **3.2.1 On Focus (A):** Focus doesn't trigger unexpected actions
- **3.2.2 On Input (A):** Changing settings doesn't cause unexpected actions
- **3.2.3 Consistent Navigation (AA):** Navigation is consistent across pages
- **3.2.4 Consistent Identification (AA):** Components with same functionality are labeled consistently
- **3.2.6 Consistent Help (A):** Help mechanisms in consistent location

#### 3.3 Input Assistance
- **3.3.1 Error Identification (A):** Errors are clearly identified
  ```html
  <uwc-text-field
    label="Email"
    error-message="Please enter a valid email address"
    invalid>
  </uwc-text-field>
  ```
- **3.3.2 Labels or Instructions (A):** Labels provided for all inputs
- **3.3.3 Error Suggestion (AA):** Suggest corrections for errors
- **3.3.4 Error Prevention (AA):** Confirmation for legal/financial transactions
- **3.3.7 Redundant Entry (A):** Don't ask for same information twice (auto-fill available)
- **3.3.8 Accessible Authentication (Minimum) (AA):** Don't require cognitive function tests (CAPTCHA alternatives)

### Robust

#### 4.1 Compatible
- **4.1.2 Name, Role, Value (A):** All UI components have accessible names, roles, states
  ```html
  <button aria-label="Close dialog" aria-pressed="false">X</button>
  <div role="alert" aria-live="polite">Changes saved successfully</div>
  ```
- **4.1.3 Status Messages (AA):** Status messages announced to screen readers
  ```html
  <div role="status" aria-live="polite" aria-atomic="true">
    Loading complete. 25 items loaded.
  </div>
  ```

---

## Implementation Guidelines

### Semantic HTML
Use native HTML elements whenever possible:
```html
<!-- Good: Native button -->
<button onclick="submit()">Submit</button>

<!-- Bad: Div button (requires extra ARIA) -->
<div role="button" tabindex="0" onclick="submit()"
     onkeypress="handleKey(event)">Submit</div>
```

### ARIA Attributes
Use ARIA to enhance semantics when native HTML is insufficient:

#### Roles
```html
<div role="navigation">...</div>
<div role="main">...</div>
<div role="complementary">...</div>
<div role="alert">...</div>
<div role="dialog" aria-modal="true">...</div>
```

#### States and Properties
```html
<button aria-expanded="false" aria-controls="menu">Menu</button>
<input aria-required="true" aria-invalid="false">
<div aria-hidden="true">Decorative content</div>
<button aria-disabled="true">Submit</button>
```

#### Live Regions
```html
<!-- Polite: Announce when user is idle -->
<div aria-live="polite">5 new messages</div>

<!-- Assertive: Announce immediately -->
<div aria-live="assertive" role="alert">Error: Payment failed</div>
```

### Keyboard Navigation
All interactive elements must be keyboard accessible:

**Tab Order:**
- Logical flow (top to bottom, left to right)
- Use `tabindex="0"` to include custom elements
- Use `tabindex="-1"` to programmatically focus elements
- Never use `tabindex > 0`

**Keyboard Shortcuts:**
- **Enter/Space:** Activate buttons
- **Escape:** Close dialogs/menus
- **Arrow Keys:** Navigate lists/menus
- **Tab:** Move forward
- **Shift+Tab:** Move backward
- **Home/End:** Jump to first/last item

**Example:**
```typescript
handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    this.closeDialog();
  } else if (e.key === 'Enter' || e.key === ' ') {
    this.selectItem();
    e.preventDefault();
  }
}
```

### Focus Management
- **Visible Focus Indicator:** Always show focus outline
- **Focus Trapping:** Keep focus within modal dialogs
- **Focus Restoration:** Return focus after closing dialogs

```typescript
openDialog() {
  this.previousFocus = document.activeElement;
  this.dialog.show();
  this.dialog.querySelector('button').focus();
}

closeDialog() {
  this.dialog.close();
  this.previousFocus?.focus();
}
```

### Color and Contrast
- **Don't rely on color alone:** Use icons, text, or patterns
  ```html
  <!-- Bad: Color only -->
  <span style="color: red">Error</span>

  <!-- Good: Icon + color + text -->
  <uwc-icon name="error" aria-hidden="true"></uwc-icon>
  <span style="color: red">Error: Invalid input</span>
  ```

- **Verify contrast ratios:**
  - Normal text (< 24px): 4.5:1
  - Large text (≥ 24px or ≥ 19px bold): 3:1
  - UI components: 3:1

### Forms
- **Label all inputs:**
  ```html
  <label for="email">Email Address</label>
  <input type="email" id="email" name="email">

  <!-- Or with aria-label -->
  <input type="search" aria-label="Search products">
  ```

- **Group related inputs:**
  ```html
  <fieldset>
    <legend>Shipping Address</legend>
    <input type="text" name="street" aria-label="Street">
    <input type="text" name="city" aria-label="City">
  </fieldset>
  ```

- **Provide clear error messages:**
  ```html
  <input type="email"
         aria-describedby="email-error"
         aria-invalid="true">
  <div id="email-error" role="alert">
    Please enter a valid email address (e.g., name@example.com)
  </div>
  ```

### Images and Icons
- **Decorative images:** Use `alt=""` or `aria-hidden="true"`
  ```html
  <img src="decorative-border.png" alt="">
  <uwc-icon name="chevron" aria-hidden="true"></uwc-icon>
  ```

- **Informative images:** Provide descriptive alt text
  ```html
  <img src="chart.png" alt="Bar chart showing revenue increased 25% in Q4 2024">
  ```

- **Complex images:** Use long description
  ```html
  <img src="org-chart.png"
       alt="Organization chart"
       aria-describedby="org-desc">
  <div id="org-desc">
    Organization chart showing CEO at top, reporting to 3 VPs...
  </div>
  ```

### Tables
Use proper table structure:
```html
<table>
  <caption>Q4 2024 Sales by Region</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Sales</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North America</th>
      <td>$2.5M</td>
    </tr>
  </tbody>
</table>
```

---

## Testing Requirements

### Automated Testing
Run automated accessibility tests in CI/CD:

**Tools:**
- **axe-core:** Catches ~57% of WCAG issues
- **pa11y:** Command-line accessibility testing
- **Lighthouse:** Accessibility audit in Chrome DevTools

**Example:**
```typescript
import { expect, fixture, html } from '@open-wc/testing';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const el = await fixture(html`<my-component></my-component>`);
  const results = await axe(el);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing
Perform manual testing before release:

1. **Keyboard Navigation:**
   - Navigate entire app using Tab, Enter, Escape, Arrow keys
   - Verify focus is visible and logical
   - Verify no keyboard traps

2. **Screen Reader Testing:**
   - Test with NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
   - Verify all content is announced correctly
   - Verify landmarks, headings, and labels are meaningful

3. **Zoom Testing:**
   - Test at 200% zoom
   - Verify no content is cut off
   - Verify no horizontal scrolling

4. **Color Contrast:**
   - Use browser extensions (e.g., axe DevTools)
   - Verify all text meets 4.5:1 (normal) or 3:1 (large)
   - Verify UI components meet 3:1

---

## UUX Component Accessibility

When using Temenos UUX components, follow these guidelines:

### Labels
Always provide labels:
```html
<uwc-text-field label="First Name" required></uwc-text-field>
<uwc-select label="Country"></uwc-select>
```

### Error Messages
Use error-message attribute:
```html
<uwc-text-field
  label="Email"
  error-message="Please enter a valid email"
  invalid>
</uwc-text-field>
```

### Disabled State
Use disabled attribute:
```html
<uwc-button disabled>Submit</uwc-button>
```

### Loading State
Use loading attribute with aria-label:
```html
<uwc-button loading aria-label="Loading, please wait">Submit</uwc-button>
```

---

## Common Accessibility Issues

### Issue 1: Missing Alt Text
```html
<!-- Bad -->
<img src="logo.png">

<!-- Good -->
<img src="logo.png" alt="Temenos logo">
```

### Issue 2: Non-Descriptive Link Text
```html
<!-- Bad -->
<a href="/report.pdf">Click here</a>

<!-- Good -->
<a href="/report.pdf">Download Q4 financial report (PDF)</a>
```

### Issue 3: Form Without Labels
```html
<!-- Bad -->
<input type="text" placeholder="Email">

<!-- Good -->
<label for="email">Email</label>
<input type="email" id="email" name="email">
```

### Issue 4: Insufficient Color Contrast
```css
/* Bad: 2.5:1 contrast */
color: #757575;
background: #ffffff;

/* Good: 4.6:1 contrast */
color: #595959;
background: #ffffff;
```

### Issue 5: Div Button
```html
<!-- Bad: Requires keyboard handling -->
<div onclick="submit()">Submit</div>

<!-- Good: Native button -->
<button onclick="submit()">Submit</button>
```

---

## Verification Checklist

Use this checklist for accessibility review:

- [ ] All images have alt text (or alt="" for decorative)
- [ ] All form inputs have labels
- [ ] Color contrast meets 4.5:1 (normal text) or 3:1 (large text, UI components)
- [ ] All functionality works with keyboard only
- [ ] Focus indicator is visible
- [ ] No keyboard traps
- [ ] Page has descriptive title
- [ ] Headings are in logical order (h1 → h2 → h3)
- [ ] Links are descriptive (not "click here")
- [ ] Error messages are clear and helpful
- [ ] Forms have fieldsets and legends for groups
- [ ] ARIA attributes used correctly
- [ ] Automated tests pass (axe, pa11y)
- [ ] Manual screen reader testing completed
- [ ] Zoom to 200% works without horizontal scroll
- [ ] Touch targets are at least 24x24px

---

## Resources

### Testing Tools
- **Axe DevTools:** Browser extension for accessibility testing
- **WAVE:** Web accessibility evaluation tool
- **Lighthouse:** Built into Chrome DevTools
- **Color Contrast Analyzer:** Desktop app for contrast checking

### Screen Readers
- **NVDA (Windows):** Free, open-source
- **JAWS (Windows):** Commercial (most popular)
- **VoiceOver (macOS/iOS):** Built-in
- **TalkBack (Android):** Built-in

### Learning Resources
- **WCAG 2.2:** https://www.w3.org/WAI/WCAG22/quickref/
- **WebAIM:** https://webaim.org/
- **A11Y Project:** https://www.a11yproject.com/
- **Inclusive Components:** https://inclusive-components.design/

---

## Related Documents

- [Quality Standards](quality-standards.md) - Testing and code quality
- [UUX Design System](..design-system/) - Accessible component usage
- [Coding Conventions](coding-conventions/) - Accessible code patterns

---

**Note:** Accessibility is a legal requirement in many jurisdictions and a moral imperative. Design for all users from the start.
