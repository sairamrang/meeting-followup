# Phase 11: Accessibility & Performance Polish

Spec: [Accessibility Standards](../../../core/standards/accessibility-standards.md), [Quality Standards - Performance](../../../core/standards/quality-standards.md#performance-standards)

Deps: Phase 10 complete (testing baseline established)

## Task 11.1: WCAG 2.2 AA Remediation & Audit {#task-111}

`apps/frontend/src/` (all components)

ultrathink

- [ ] Run axe-core automated scan on all pages
- [ ] Fix automated violations:
  - Missing alt text on images
  - Insufficient color contrast (update Tailwind utilities if needed)
  - Missing form labels
  - Improper heading hierarchy
  - Missing ARIA attributes
- [ ] Manual testing:
  - Keyboard-only navigation (Tab, Shift+Tab, Enter, Escape, Arrow keys)
  - Test with screen reader: VoiceOver (macOS) or NVDA (Windows)
  - Verify focus indicators visible and logical
  - Test 200% zoom: no content cutoff, readable text
- [ ] Fix identified issues:
  - Add aria-label/aria-describedby to custom components
  - Update focus visible styles (ensure 2px outline, sufficient contrast)
  - Add role attributes to semantic components
  - Fix heading order (no h1 → h3 skips)
- [ ] Verify: Lighthouse accessibility score ≥95
- [ ] Create accessibility audit checklist in code comments

**Maps to:** Accessibility standards (WCAG 2.2 AA), quality standards

---

## Task 11.2: Focus Management & Keyboard Navigation {#task-112}

`apps/frontend/src/components/`, `apps/frontend/src/hooks/use-keyboard-nav.ts`

think hard

- [ ] Audit all pages for logical tab order:
  - Header nav → Main content → Sidebar → Footer
  - Within forms: label → input → error → submit
- [ ] Test with Tab key: focus moves predictably
- [ ] Verify focus trap in modals (focus stays inside modal)
- [ ] Implement focus restoration after modal close
- [ ] Add keyboard shortcuts (optional, but good to have):
  - `?` to open help
  - `n` to create new follow-up
  - `s` to save (draft)
  - `p` to publish
- [ ] Create `useKeyboardShortcuts()` hook with remappable shortcuts
- [ ] Test: Navigate entire app with keyboard only; verify no traps

**Maps to:** Accessibility standards (2.1.1 Keyboard, 2.1.2 No Keyboard Trap)

---

## Task 11.3: Color Contrast & Visual Design Audit {#task-113}

`apps/frontend/tailwind.config.js`, `apps/frontend/src/styles/`

- [ ] Audit all text/background combinations for contrast:
  - Normal text: 4.5:1 ratio
  - Large text (>18px): 3:1 ratio
  - UI components: 3:1 ratio
- [ ] Use axe DevTools or WebAIM contrast checker
- [ ] Update color palette if needed:
  - Darken text colors
  - Lighten backgrounds
  - Or adjust primary/secondary colors
- [ ] Update Tailwind config with accessible color utilities
- [ ] Test links, buttons, form inputs, error messages
- [ ] Verify error messaging uses text + color (not color alone)
- [ ] Test: Run automated contrast checks; verify all pass

**Maps to:** Accessibility standards (1.4.3 Contrast, 1.4.11 Non-text Contrast)

---

## Task 11.4: Form Accessibility - Labels & Validation {#task-114}

`apps/frontend/src/components/forms/`

- [ ] Audit all form inputs:
  - All inputs have associated labels (`<label for="...">`)
  - Labels are descriptive ("Email Address", not just "Email")
  - Required fields marked with `required` attribute or `aria-required="true"`
- [ ] Error message accessibility:
  - Error messages linked to input via `aria-describedby`
  - Error messages have `role="alert"` for screen reader announcement
  - Error text is red + icon (not just color)
- [ ] Form grouping:
  - Related inputs wrapped in `<fieldset>` with `<legend>`
  - Example: "Shipping Address" fieldset with street, city, zip
- [ ] Test with screen reader: form navigation and errors announced
- [ ] Test: Tab through form; verify all labels, required status, errors announced

**Maps to:** Accessibility standards (3.3.1 Error Identification, 3.3.2 Labels)

---

## Task 11.5: Performance Optimization - Code Splitting & Lazy Loading {#task-115}

`apps/frontend/vite.config.ts`, `apps/frontend/src/` (routes)

think hard

- [ ] Implement route-based code splitting:
  - Dashboard: main chunk
  - Companies: separate chunk
  - Follow-ups: separate chunk
  - Editor: separate chunk (large due to Tiptap)
  - Analytics: separate chunk (includes Recharts)
  - Public viewer: separate chunk (minimal, fast load)
- [ ] Use React Router lazy loading: `React.lazy()` + `Suspense`
- [ ] Lazy load heavy libraries:
  - Tiptap: only load in editor
  - Recharts: only load in analytics
  - react-dropzone: only load in file upload component
- [ ] Measure bundle size improvement: `npm run build --report`
- [ ] Target: main chunk <150KB, app total <300KB
- [ ] Test: Load app → only main chunk loads; navigate to page → chunk loads

**Maps to:** Performance standards (<3s load time)

---

## Task 11.6: Performance Optimization - Image & Asset Optimization {#task-116}

`apps/frontend/src/assets/`, `apps/frontend/vite.config.ts`

- [ ] Optimize images:
  - Convert to WebP format (with fallback JPG)
  - Use responsive images: `srcset` for multiple sizes
  - Lazy load below-fold images: `loading="lazy"`
- [ ] Configure Vite image optimization:
  - Compress PNG/JPG
  - Inline small SVGs
  - Optimize SVG with svgo
- [ ] Optimize company logos:
  - Store as URL (from API) when possible
  - Lazy load image in cards
- [ ] Optimize chart SVGs:
  - Generated by Recharts (already optimized)
- [ ] Test: Measure image sizes before/after; verify visual quality

**Maps to:** Performance standards (asset loading)

---

## Task 11.7: Performance Monitoring & Observability {#task-117}

`apps/frontend/src/lib/monitoring.ts`, `apps/frontend/src/hooks/use-web-vitals.ts`

- [ ] Setup Web Vitals monitoring:
  - Use `web-vitals` package to track LCP, FID, CLS
  - Send metrics to analytics endpoint (or external service like Sentry)
- [ ] Add custom performance marks:
  - Auto-save latency
  - API response times
  - Component render times
- [ ] Setup error tracking:
  - Send errors to external service (Sentry, Rollbar, etc.)
  - Include context: user, page, action
- [ ] Dashboard for monitoring:
  - Real-time performance metrics
  - Error rate and trends
  - User impact (affected users)
- [ ] Alerts:
  - LCP > 2.5s
  - Error rate > 1%
  - API response > 500ms

**Maps to:** Performance standards, reliability standards (observability)

---

## Task 11.8: SEO & Metadata for Public Viewer {#task-118}

`apps/frontend/src/pages/public-viewer.tsx`, `apps/frontend/src/lib/seo.ts`

- [ ] Add meta tags to public viewer page:
  - `<title>`: follow-up title + company name
  - `<meta name="description">`: follow-up recap snippet
  - `<meta name="og:title">`: share title
  - `<meta name="og:description">`: share description
  - `<meta name="og:image">`: company logo
  - `<meta name="twitter:*">`: Twitter share metadata
- [ ] Create helmet integration for SSR if needed
- [ ] Add structured data (JSON-LD):
  - Organization schema (company)
  - Article schema (follow-up as document)
- [ ] Test: Share URL on social media; verify preview shows

**Maps to:** UX polish, user convenience

---

## Task 11.9: Final Performance Audit & Report {#task-119}

`apps/frontend/PERFORMANCE.md`, `apps/frontend/lighthouse-report.html`

- [ ] Run Lighthouse audit on production build
- [ ] Measure Core Web Vitals:
  - LCP: <2.5s ✓
  - FID: <100ms ✓
  - CLS: <0.1 ✓
- [ ] Measure page load: <3s on 3G ✓
- [ ] Measure bundle size: <300KB total ✓
- [ ] Run accessibility audit: score ≥95 ✓
- [ ] Create performance report: `PERFORMANCE.md`
  - Current metrics vs targets
  - Optimization techniques applied
  - Recommendations for future improvements
- [ ] Setup continuous monitoring in CI/CD

**Maps to:** Performance standards, quality standards

---

## Acceptance Criteria Checkpoints

- [x] WCAG 2.2 AA compliance verified *(Tasks 11.1, 11.3, 11.4)*
- [x] Keyboard navigation fully working *(Task 11.2)*
- [x] Performance targets met (<3s load, <2.5s LCP) *(Tasks 11.5-11.6)*
- [x] Monitoring and observability in place *(Task 11.7)*
- [x] Audit reports generated *(Tasks 11.5, 11.9)*

