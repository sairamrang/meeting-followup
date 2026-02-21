# Temenos UUX Design System - Design Tokens

## Overview

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They are used in place of hard-coded values (such as hex values for color or pixel values for spacing) to ensure consistency and enable scalable design.

**Benefits of Design Tokens:**
- Consistent visual design across products
- Single source of truth for design values
- Easy theming and customization
- Automatic updates when design system evolves
- Platform-agnostic (can be used across web, iOS, Android)

---

## Color Tokens

### Brand Colors (Temenos Palette)

```css
/* Light Theme */
--uwc-color-brand-darkest: #2C3361;
--uwc-color-brand-dark: #293276;
--uwc-color-brand-primary: #4A5798;
--uwc-color-brand-light: #C9D9F2;
--uwc-color-brand-lightest: #EBF3FF;
```

### Grayscale Colors

```css
/* Neutral Colors */
--uwc-color-gray-darkest: #000000;
--uwc-color-gray-dark: #3B3B3B;
--uwc-color-gray-primary: #757575;
--uwc-color-gray-light: #E5E5E5;
--uwc-color-gray-lightest: #F2F2F2;

/* Semantic Aliases */
--uwc-color-text-primary: var(--uwc-color-gray-dark);
--uwc-color-text-secondary: var(--uwc-color-gray-primary);
--uwc-color-border: var(--uwc-color-gray-light);
--uwc-color-background-subtle: var(--uwc-color-gray-lightest);
```

### Status Positive (Green)

```css
/* Success / Positive States */
--uwc-color-status-positive-darkest: #494911;
--uwc-color-status-positive-dark: #5B5B15;
--uwc-color-status-positive-primary: #707016;
--uwc-color-status-positive-light: #DDDD93;
--uwc-color-status-positive-lightest: #F3F3D8;

/* Semantic Aliases */
--uwc-color-success: var(--uwc-color-status-positive-primary);
--uwc-color-success-bg: var(--uwc-color-status-positive-lightest);
```

### Status Negative (Red)

```css
/* Error / Negative States */
--uwc-color-status-negative-darkest: #541212;
--uwc-color-status-negative-dark: #932020;
--uwc-color-status-negative-primary: #D32E2F;
--uwc-color-status-negative-light: #F6D5D5;
--uwc-color-status-negative-lightest: #FCF4F4;

/* Semantic Aliases */
--uwc-color-error: var(--uwc-color-status-negative-primary);
--uwc-color-error-bg: var(--uwc-color-status-negative-lightest);
```

### Status Notice (Orange)

```css
/* Warning / Notice States */
--uwc-color-status-notice-darkest: #523000;
--uwc-color-status-notice-dark: #995C00;
--uwc-color-status-notice-primary: #CC7E0B;
--uwc-color-status-notice-light: #FFEACC;
--uwc-color-status-notice-lightest: #FFF9F2;

/* Semantic Aliases */
--uwc-color-warning: var(--uwc-color-status-notice-primary);
--uwc-color-warning-bg: var(--uwc-color-status-notice-lightest);
```

### Categorical Colors (Data Visualization)

```css
/* Light Theme Data Visualization */
--uwc-color-categorical-light-1: #293276;  /* Warm Blue */
--uwc-color-categorical-light-2: #C9D9F2;  /* Light Blue */
--uwc-color-categorical-light-3: #F08261;  /* Coral Orange */
--uwc-color-categorical-light-4: #C7C703;  /* Moss Green */
--uwc-color-categorical-light-5: #F06292;  /* Pink */
--uwc-color-categorical-light-6: #9575CD;  /* Purple */
--uwc-color-categorical-light-7: #689F38;  /* Green */
--uwc-color-categorical-light-8: #0097A7;  /* Cyan */

/* Dark Theme Data Visualization */
/* (To be defined based on dark theme requirements) */
```

---

## Spacing Tokens

### Grid Units

```css
/* Base Grid Unit: 8px */
--uwc-grid-unit: 8px;

/* Common Spacing Values */
--uwc-spacing-0-5: 4px;   /* 0.5G */
--uwc-spacing-1: 8px;     /* 1G */
--uwc-spacing-2: 16px;    /* 2G */
--uwc-spacing-3: 24px;    /* 3G */
--uwc-spacing-4: 32px;    /* 4G */
--uwc-spacing-5: 40px;    /* 5G */
--uwc-spacing-6: 48px;    /* 6G */
--uwc-spacing-8: 64px;    /* 8G */
--uwc-spacing-10: 80px;   /* 10G */
--uwc-spacing-12: 96px;   /* 12G */
```

### Layout Spacing

```css
/* Gutters */
--uwc-layout-gutter: 24px;  /* 3G - constant across densities */

/* Container Padding */
--uwc-layout-padding-standard: 24px;  /* 3G */
--uwc-layout-padding-compact: 16px;   /* 2G */

/* Component Margins */
--uwc-component-margin-bottom: 8px;   /* 1G - default */
--uwc-fieldset-margin-bottom: 8px;    /* 1G - default */
--uwc-fieldset-margin-bottom-error: 24px;  /* 3G - with error */
```

### Component Padding

```css
/* Card Padding */
--uwc-card-padding-standard: 24px;   /* 3G */
--uwc-card-padding-compact: 16px;    /* 2G */
--uwc-card-padding-bottom: 32px;     /* 4G - includes last component */

/* Input Component Padding */
--uwc-input-padding-horizontal: 16px;  /* 2G */
--uwc-input-padding-bottom: 16px;      /* 2G - for error messages */

/* Button Padding */
--uwc-button-padding-horizontal: 16px;  /* 2G */
--uwc-button-spacing: 16px;             /* 2G - between buttons */
```

---

## Typography Tokens

### Font Family

```css
--uwc-font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI",
                           Roboto, "Helvetica Neue", Arial, sans-serif;
--uwc-font-family-monospace: "SF Mono", Monaco, "Courier New", monospace;
```

### Font Sizes

```css
/* Type Scale */
--uwc-font-size-h1-emphasis: 34px;  /* Page Heading */
--uwc-font-size-h1: 24px;           /* Page Sub-heading */
--uwc-font-size-h2-emphasis: 20px;  /* Card Group Title */
--uwc-font-size-h2: 20px;           /* Card Title */
--uwc-font-size-h3-emphasis: 16px;  /* Section Title */
--uwc-font-size-h3: 16px;           /* Section Sub-heading */
--uwc-font-size-large: 16px;        /* Large Text */
--uwc-font-size-body: 14px;         /* Body Text */
--uwc-font-size-small: 12px;        /* Caption / Help Text */
```

### Line Heights

```css
/* Line Heights (relative to font size) */
--uwc-line-height-h1-emphasis: 40px;  /* ~1.18 */
--uwc-line-height-h1: 32px;           /* ~1.33 */
--uwc-line-height-h2: 28px;           /* ~1.4 */
--uwc-line-height-h3: 24px;           /* ~1.5 */
--uwc-line-height-large: 24px;        /* ~1.5 */
--uwc-line-height-body: 20px;         /* ~1.43 */
--uwc-line-height-small: 16px;        /* ~1.33 */

/* Relative line heights for flexible text */
--uwc-line-height-tight: 1.25;
--uwc-line-height-normal: 1.5;
--uwc-line-height-relaxed: 1.75;
```

### Font Weights

```css
--uwc-font-weight-regular: 400;
--uwc-font-weight-medium: 500;
--uwc-font-weight-bold: 700;

/* Semantic Aliases */
--uwc-font-weight-heading: var(--uwc-font-weight-regular);
--uwc-font-weight-heading-emphasis: var(--uwc-font-weight-bold);
--uwc-font-weight-body: var(--uwc-font-weight-regular);
```

---

## Component Size Tokens

### Input Components

```css
/* Text Fields, Dropdowns, etc. */
--uwc-input-height-standard: 56px;  /* Medium */
--uwc-input-height-compact: 40px;   /* Small */
```

### Group Components

```css
/* Radio Groups, Checkbox Groups */
--uwc-group-item-height-standard: 40px;  /* Medium */
--uwc-group-item-height-compact: 32px;   /* Small */
```

### Buttons

```css
/* CTA and Outlined Buttons */
--uwc-button-height-standard: 48px;  /* X-Large */
--uwc-button-height-compact: 40px;   /* Large */
--uwc-button-min-width: 64px;
```

### Interactive Element Sizes

```css
/* Radio Buttons */
--uwc-radio-size-standard: 20px;
--uwc-radio-size-compact: 16px;

/* Checkboxes */
--uwc-checkbox-size-standard: 18px;
--uwc-checkbox-size-compact: 16px;

/* Touch Targets */
--uwc-touch-target-min: 40px;
--uwc-touch-target-recommended: 48px;
```

---

## Border Tokens

### Border Widths

```css
--uwc-border-width-thin: 1px;
--uwc-border-width-regular: 2px;
--uwc-border-width-thick: 4px;

/* Component-Specific */
--uwc-input-border-width-default: 1px;
--uwc-input-border-width-hover: 2px;
--uwc-input-border-width-focus: 2px;
--uwc-focus-outline-width: 2px;
```

### Border Radius

```css
--uwc-border-radius-small: 2px;
--uwc-border-radius-medium: 4px;
--uwc-border-radius-large: 8px;
--uwc-border-radius-xlarge: 16px;
--uwc-border-radius-full: 9999px;  /* Fully rounded */

/* Component-Specific */
--uwc-card-border-radius: 4px;
--uwc-button-border-radius: 4px;
--uwc-input-border-radius: 4px;
```

---

## Elevation / Shadow Tokens

```css
/* Material Design Elevation Levels */
--uwc-elevation-0: none;
--uwc-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12),
                   0 1px 2px rgba(0, 0, 0, 0.24);
--uwc-elevation-2: 0 3px 6px rgba(0, 0, 0, 0.16),
                   0 3px 6px rgba(0, 0, 0, 0.23);
--uwc-elevation-3: 0 10px 20px rgba(0, 0, 0, 0.19),
                   0 6px 6px rgba(0, 0, 0, 0.23);
--uwc-elevation-4: 0 14px 28px rgba(0, 0, 0, 0.25),
                   0 10px 10px rgba(0, 0, 0, 0.22);
--uwc-elevation-5: 0 19px 38px rgba(0, 0, 0, 0.30),
                   0 15px 12px rgba(0, 0, 0, 0.22);

/* Component-Specific */
--uwc-card-elevation: var(--uwc-elevation-2);
--uwc-dropdown-elevation: var(--uwc-elevation-3);
--uwc-dialog-elevation: var(--uwc-elevation-5);
--uwc-button-hover-elevation: var(--uwc-elevation-2);
```

---

## Animation / Transition Tokens

```css
/* Duration */
--uwc-transition-fast: 100ms;
--uwc-transition-normal: 200ms;
--uwc-transition-slow: 300ms;

/* Timing Functions */
--uwc-easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
--uwc-easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--uwc-easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);

/* Combined Transitions */
--uwc-transition-color: color var(--uwc-transition-normal) var(--uwc-easing-standard);
--uwc-transition-bg: background-color var(--uwc-transition-normal) var(--uwc-easing-standard);
--uwc-transition-border: border-color var(--uwc-transition-normal) var(--uwc-easing-standard);
--uwc-transition-transform: transform var(--uwc-transition-normal) var(--uwc-easing-standard);
--uwc-transition-all: all var(--uwc-transition-normal) var(--uwc-easing-standard);
```

---

## Z-Index Tokens

```css
/* Z-Index Scale */
--uwc-z-index-dropdown: 1000;
--uwc-z-index-sticky: 1020;
--uwc-z-index-fixed: 1030;
--uwc-z-index-modal-backdrop: 1040;
--uwc-z-index-modal: 1050;
--uwc-z-index-popover: 1060;
--uwc-z-index-tooltip: 1070;
```

---

## Usage Examples

### Applying Color Tokens

```css
/* Component styling using color tokens */
.primary-button {
  background-color: var(--uwc-color-brand-primary);
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: var(--uwc-color-brand-dark);
}

.error-message {
  color: var(--uwc-color-error);
  background-color: var(--uwc-color-error-bg);
  padding: var(--uwc-spacing-2);
  border-radius: var(--uwc-border-radius-medium);
}
```

### Applying Spacing Tokens

```css
/* Layout using spacing tokens */
.card {
  padding: var(--uwc-card-padding-standard);
  margin-bottom: var(--uwc-spacing-3);
  border-radius: var(--uwc-card-border-radius);
  box-shadow: var(--uwc-card-elevation);
}

.form-field {
  margin-bottom: var(--uwc-component-margin-bottom);
  padding-bottom: var(--uwc-input-padding-bottom);
}
```

### Applying Typography Tokens

```css
/* Typography using design tokens */
h1 {
  font-family: var(--uwc-font-family-primary);
  font-size: var(--uwc-font-size-h1);
  line-height: var(--uwc-line-height-h1);
  font-weight: var(--uwc-font-weight-heading);
  color: var(--uwc-color-brand-darkest);
}

.body-text {
  font-size: var(--uwc-font-size-body);
  line-height: var(--uwc-line-height-body);
  color: var(--uwc-color-text-primary);
}
```

### Responsive Spacing

```css
/* Responsive container padding */
.container {
  padding: var(--uwc-layout-padding-standard);
}

@media (max-width: 768px) {
  .container {
    padding: var(--uwc-layout-padding-compact);
  }
}
```

---

## Token Categories Summary

| Category | Token Count | Purpose |
|----------|-------------|---------|
| **Colors** | 30+ | Brand, grayscale, status, categorical |
| **Spacing** | 20+ | Grid units, margins, padding, gutters |
| **Typography** | 25+ | Font families, sizes, weights, line heights |
| **Sizing** | 15+ | Component heights, widths, touch targets |
| **Borders** | 10+ | Widths, radius values |
| **Elevation** | 6+ | Shadow depths for layering |
| **Animation** | 8+ | Durations, easing functions |
| **Z-Index** | 7+ | Layering hierarchy |

---

## Implementation Guidelines

### Best Practices

1. **Always use tokens** instead of hard-coded values
2. **Create semantic aliases** for specific use cases
3. **Maintain consistency** across all implementations
4. **Document custom tokens** if you extend the system
5. **Use CSS custom properties** for runtime theming
6. **Validate token usage** in code reviews

### CSS Custom Properties Setup

```css
:root {
  /* Load all design tokens */
  @import 'design-tokens.css';
}

/* Optional: Dark theme override */
[data-theme="dark"] {
  --uwc-color-background: var(--uwc-color-gray-darkest);
  --uwc-color-text-primary: var(--uwc-color-gray-lightest);
  /* Override other tokens as needed */
}
```

### JavaScript/TypeScript Usage

```typescript
// Access tokens programmatically
const brandPrimary = getComputedStyle(document.documentElement)
  .getPropertyValue('--uwc-color-brand-primary');

// Set tokens dynamically
document.documentElement.style
  .setProperty('--uwc-color-brand-primary', '#4A5798');
```

---

## Extending the Token System

If you need to create custom tokens for project-specific needs:

```css
/* Custom project tokens */
:root {
  /* Use UUX tokens as base */
  --project-header-bg: var(--uwc-color-brand-darkest);
  --project-header-text: white;

  /* Or define new values following naming convention */
  --project-sidebar-width: 240px;
  --project-content-max-width: 1200px;
}
```

**Naming Convention for Custom Tokens:**
- Start with project prefix (e.g., `--project-`)
- Use kebab-case
- Be descriptive and specific
- Reference UUX tokens when possible

---

## References

- See [02-colors.md](02-colors.md) for detailed color usage guidelines
- See [03-typography.md](03-typography.md) for typography specifications
- See [04-layout-spacing.md](04-layout-spacing.md) for spacing system details
- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Material Design - Design Tokens](https://m3.material.io/foundations/design-tokens/overview)
