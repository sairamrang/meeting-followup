# Temenos UUX Design System - Colors

## Overview

Color is a powerful tool for conveying meaning and emphasizing elements and actions to users. The UUX color system plays an essential role in maintaining consistent and engaging digital experiences across all Temenos applications.

**Blue is at the heart of Temenos.** Our color system is based on a blue palette inspired by the Temenos primary brand color, supplemented with neutral grays and purpose-driven status colors.

---

## Color System Structure

The UUX color system includes:
- **Temenos Palette** - Primary brand colors (blue-based)
- **Grayscale Palette** - Neutral colors for text and inactive elements
- **Status Palettes** - Positive (green), Negative (red), Notice (orange)
- **Categorical Palettes** - For data visualization (light and dark variants)

Each palette includes **five color variations**: Darkest, Dark, Primary, Light, and Lightest.

---

## Temenos Palette

Colors from the Temenos palette are displayed most frequently across screens and components. Use these colors to highlight UI elements that are important, interactive, and must stand out.

The primary color has increased brightness and is used to indicate the main CTA (call-to-action) and interactive elements.

### Light Theme

| Variation | Hex Code | Design Token | Usage |
|-----------|----------|--------------|-------|
| **Darkest** | `#2C3361` | `--uwc-color-brand-darkest` | Main color stripe on page, navigation rail (use sparingly) |
| **Dark** | `#293276` | `--uwc-color-brand-dark` | Most headings and graphical elements requiring good contrast |
| **Primary** | `#4A5798` | `--uwc-color-brand-primary` | CTA buttons and interactive elements |
| **Light** | `#C9D9F2` | `--uwc-color-brand-light` | Subtle structure to pages and elements |
| **Lightest** | `#EBF3FF` | `--uwc-color-brand-lightest` | Main background color with subtle defining edge |

### Color Usage Guidelines

- **Darkest** - Reserved for the main color stripe on the page to reflect Temenos branding. Use sparingly apart from navigation rail.
- **Dark** - Use for most headings and graphical elements that require good contrast.
- **Primary** - Primary action color for CTAs and interactive elements.
- **Light** - Adds subtle structure to pages and elements.
- **Lightest** - Main background color offering a subtle edge to large objects like cards.

---

## Grayscale Palette

The Grayscale palette gives more emphasis to the Temenos palette and contributes to UI with less visual noise (following the "Aesthetics with a Purpose" principle).

### Light Theme

| Variation | Hex Code | Design Token | Usage |
|-----------|----------|--------------|-------|
| **Darkest** | `#000000` | `--uwc-color-gray-darkest` | Smaller text (use sparingly) |
| **Dark** | `#3B3B3B` | `--uwc-color-gray-dark` | Main text choice |
| **Primary** | `#757575` | `--uwc-color-gray-primary` | Good contrast on white background |
| **Light** | `#E5E5E5` | `--uwc-color-gray-light` | Framing objects and inactive components |
| **Lightest** | `#F2F2F2` | `--uwc-color-gray-lightest` | Subtle bigger block areas |

### Color Usage Guidelines

These colors are mainly used for text and inactive elements:
- **Darkest** - Use sparingly, for smaller text requiring maximum contrast
- **Dark** - The primary choice for body text
- **Primary** - Offers good contrast on white backgrounds
- **Light** - Mainly for framing objects and inactive components
- **Lightest** - For very subtle larger block areas

---

## Status Palettes

Status colors are used only in special cases like form validation, messaging, and indicating system states. Each status palette consists of five color variations.

### Status Positive Palette (Green)

Use to indicate positive values like passing verification or credit balance.

| Variation | Hex Code | Design Token |
|-----------|----------|--------------|
| **Darkest** | `#494911` | `--uwc-color-status-positive-darkest` |
| **Dark** | `#5B5B15` | `--uwc-color-status-positive-dark` |
| **Primary** | `#707016` | `--uwc-color-status-positive-primary` |
| **Light** | `#DDDD93` | `--uwc-color-status-positive-light` |
| **Lightest** | `#F3F3D8` | `--uwc-color-status-positive-lightest` |

### Status Negative Palette (Red)

Use to indicate negative or adverse values like failing verification or debit balance.

| Variation | Hex Code | Design Token |
|-----------|----------|--------------|
| **Darkest** | `#541212` | `--uwc-color-status-negative-darkest` |
| **Dark** | `#932020` | `--uwc-color-status-negative-dark` |
| **Primary** | `#D32E2F` | `--uwc-color-status-negative-primary` |
| **Light** | `#F6D5D5` | `--uwc-color-status-negative-light` |
| **Lightest** | `#FCF4F4` | `--uwc-color-status-negative-lightest` |

### Status Notice Palette (Orange)

Use when you need to bring something to the user's attention (warnings, important information).

| Variation | Hex Code | Design Token |
|-----------|----------|--------------|
| **Darkest** | `#523000` | `--uwc-color-status-notice-darkest` |
| **Dark** | `#995C00` | `--uwc-color-status-notice-dark` |
| **Primary** | `#CC7E0B` | `--uwc-color-status-notice-primary` |
| **Light** | `#FFEACC` | `--uwc-color-status-notice-light` |
| **Lightest** | `#FFF9F2` | `--uwc-color-status-notice-lightest` |

---

## Categorical Palettes

Categorical (qualitative) palettes are best for distinguishing discrete categories of data without inherent correlation. The sequence is carefully curated to maximize contrast between neighboring colors.

**IMPORTANT:** Apply these colors **in sequence strictly as shown** to ensure maximum visual differentiation.

### Light Categorical Palette

Use when the background color is closer to white than black.

| Color Name | Hex Code | Design Token |
|------------|----------|--------------|
| **Warm Blue** | `#293276` | `--uwc-color-categorical-light-1` |
| **Light Blue** | `#C9D9F2` | `--uwc-color-categorical-light-2` |
| **Coral Orange** | `#F08261` | `--uwc-color-categorical-light-3` |
| **Moss Green** | `#C7C703` | `--uwc-color-categorical-light-4` |
| **Pink** | `#F06292` | `--uwc-color-categorical-light-5` |
| **Purple** | `#9575CD` | `--uwc-color-categorical-light-6` |
| **Green** | `#689F38` | `--uwc-color-categorical-light-7` |
| **Cyan** | `#0097A7` | `--uwc-color-categorical-light-8` |

### Dark Categorical Palette

Use when the background color is closer to black than white.

*Note: Dark categorical palette colors would be defined similarly with adjusted contrast for dark backgrounds. Refer to source documentation for specific values.*

---

## Component States

Colors help indicate each element's state. For example, grey text and background make a button look disabled.

### Common State Colors

- **Default/Rest** - Use Primary colors from appropriate palette
- **Hover** - Use Light or Dark variations
- **Active/Pressed** - Use Dark variations
- **Disabled** - Use Grayscale Light or Lightest
- **Error** - Use Status Negative palette
- **Success** - Use Status Positive palette
- **Warning** - Use Status Notice palette

---

## Accessibility

All colors and color contrasts in the UUX design system have been validated to meet **WCAG 2.2 AA accessibility guidelines**.

### Contrast Requirements

To create accessible UIs, ensure color combinations meet the following AA contrast requirements:

- **4.5:1** - Standard text: All text and non-text elements
- **3:1** - Large, heavier text: Text 18px and above, 14px bold and above, and non-text elements requiring contrast

### Contrast Between Elements

To create contrast between elements (such as a top app bar from a system bar), use light or dark variants of the primary colors. These can also distinguish elements within a component.

The WCAG 2 compliant color combinations in our color system ensure accessible designs. Always verify contrast ratios when creating custom color combinations.

**Reference:** [WCAG 2.2, 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)

---

## Design Tokens

All colors in the design system are represented by design tokens (CSS custom properties). This allows for:
- Consistent color usage across components
- Easy theming and customization
- Automatic updates when the design system evolves

For a complete list of color-related design tokens, see [07-design-tokens.md](07-design-tokens.md).

### Example Usage

```css
/* Using design tokens */
.primary-button {
  background-color: var(--uwc-color-brand-primary);
  color: #ffffff;
}

.error-message {
  color: var(--uwc-color-status-negative-primary);
  background-color: var(--uwc-color-status-negative-lightest);
}
```

---

## Best Practices

1. **Use design tokens** instead of hard-coded hex values
2. **Maintain contrast ratios** for accessibility (4.5:1 minimum for text)
3. **Use status colors sparingly** - only for their intended purpose
4. **Follow categorical color sequence** for data visualization
5. **Test color combinations** with accessibility tools
6. **Prioritize Temenos blue** as the primary action color
7. **Use grayscale** for text and inactive states to reduce visual noise

---

## References

- [Material Design - Color System](https://material.io/design/color/the-color-system.html)
- [Material Design - Applying Color to UI](https://material.io/design/color/applying-color-to-ui.html)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Web Content Accessibility Guidelines
