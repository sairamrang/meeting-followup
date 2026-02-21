# Color Contrast Requirements

## WCAG 2.2 Contrast Ratios

### Minimum Requirements (Level AA)

| Text Type | Minimum Ratio | Examples |
|-----------|---------------|----------|
| **Normal text** | 4.5:1 | Body text, labels, links |
| **Large text** | 3:1 | 18px+ regular, 14px+ bold |
| **UI components** | 3:1 | Buttons, inputs, icons |
| **Graphical objects** | 3:1 | Charts, diagrams |

### Enhanced Requirements (Level AAA)

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text | 7:1 |
| Large text | 4.5:1 |

---

## Calculating Contrast

### Contrast Ratio Formula

```
(L1 + 0.05) / (L2 + 0.05)

Where:
- L1 = relative luminance of lighter color
- L2 = relative luminance of darker color
```

### Tools for Checking

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker/)
- [Accessible Colors](https://accessible-colors.com/)
- Chrome DevTools (Inspect > Color picker)
- Firefox DevTools (Accessibility Inspector)

---

## Common Combinations

### ✅ Passing Combinations

| Foreground | Background | Ratio | Use |
|------------|------------|-------|-----|
| #000000 | #FFFFFF | 21:1 | Maximum contrast |
| #3B3B3B | #FFFFFF | 10.7:1 | Standard dark text |
| #595959 | #FFFFFF | 7:1 | Body text |
| #767676 | #FFFFFF | 4.54:1 | Minimum for small text |
| #FFFFFF | #4A5798 | 7.2:1 | White on primary |
| #FFFFFF | #2C3361 | 11.3:1 | White on dark blue |

### ❌ Failing Combinations

| Foreground | Background | Ratio | Problem |
|------------|------------|-------|---------|
| #999999 | #FFFFFF | 2.85:1 | Too light |
| #757575 | #FFFFFF | 4.48:1 | Fails AA (barely) |
| #C0C0C0 | #FFFFFF | 1.6:1 | Way too light |
| #FF0000 | #00FF00 | 1:1 | Red-green colorblind issue |

---

## Best Practices

### Don't Rely on Color Alone

Color should never be the only indicator of meaning.

```
❌ "Fields marked in red are required"
✅ "Fields marked with * are required" + red color + icon
```

### Provide Multiple Cues

| Information | Color | Additional Cue |
|-------------|-------|----------------|
| Error | Red | Error icon + message |
| Success | Green | Check icon + message |
| Warning | Orange | Warning icon + message |
| Link | Blue | Underline |
| Required | Any | Asterisk (*) |
| Current/selected | Blue | Bold + background |

### State Indication

Each state should be distinguishable without color:

| State | Visual Indicator |
|-------|------------------|
| Focus | Outline ring |
| Selected | Check mark, bold |
| Disabled | Opacity + cursor |
| Error | Icon + border |
| Active | Underline, weight |

---

## Color Blindness Considerations

### Types of Color Vision Deficiency

| Type | Affected | Prevalence |
|------|----------|------------|
| Deuteranomaly | Red-green (green weak) | 5% of men |
| Protanomaly | Red-green (red weak) | 2.5% of men |
| Tritanomaly | Blue-yellow | 0.01% |
| Monochromacy | All colors | 0.00003% |

### Problematic Color Pairs

Avoid relying on these distinctions:

- Red vs. Green
- Red vs. Brown
- Blue vs. Purple
- Green vs. Brown
- Light green vs. Yellow

### Safe Color Pairs

These work for most color-blind users:

- Blue vs. Orange
- Blue vs. Yellow
- Purple vs. Yellow
- Black vs. White
- Dark blue vs. Light blue

---

## Testing for Color Blindness

### Simulation Tools

- **Stark** - Figma/Sketch plugin
- **Color Oracle** - Desktop simulator
- **Colorblindly** - Chrome extension
- **Firefox** - DevTools > Accessibility > Simulate

### Testing Checklist

- [ ] Test with deuteranopia simulation
- [ ] Test with protanopia simulation
- [ ] Test in grayscale
- [ ] Verify information not lost without color
- [ ] Check error states visible
- [ ] Check links distinguishable
- [ ] Check charts/graphs readable

---

## Contrast in Different Contexts

### Dark Mode

Same rules apply, but consider:
- Pure white (#FFFFFF) on black can be harsh
- Use off-white (#E0E0E0 to #F5F5F5) for comfort
- Maintain minimum ratios

### High Contrast Mode

Support Windows High Contrast Mode:
- Test with high contrast themes
- Don't override forced colors
- Use `forced-colors` media query

```css
@media (forced-colors: active) {
  /* Adjustments for high contrast mode */
}
```

### Outdoor/Bright Light

- Higher contrast helps visibility
- Consider minimum 5:1 for mobile apps
- Test in bright conditions

---

## Implementation Tips

### CSS Custom Properties

```css
:root {
  --color-text-primary: #3B3B3B;     /* 10.7:1 on white */
  --color-text-secondary: #595959;   /* 7:1 on white */
  --color-text-disabled: #767676;    /* 4.54:1 on white */
  --color-link: #0066CC;             /* 5.1:1 on white */
  --color-error: #CC0000;            /* 5.9:1 on white */
}
```

### Focus Indicators

```css
:focus {
  outline: 2px solid #4A5798;  /* 3:1 ratio minimum */
  outline-offset: 2px;
}
```

### Border for Inputs

```css
input {
  border: 1px solid #767676;  /* 3:1 ratio for UI components */
}

input:focus {
  border-color: #4A5798;
  outline: 2px solid #4A5798;
}
```

---

## Quick Reference Card

### Ratios to Remember

| Ratio | Use For |
|-------|---------|
| **4.5:1** | Normal text (AA) |
| **3:1** | Large text, UI components |
| **7:1** | Normal text (AAA) |
| **21:1** | Maximum (black on white) |

### Common Grays on White

| Gray | Ratio | Passes |
|------|-------|--------|
| #333333 | 12.6:1 | AA, AAA |
| #595959 | 7:1 | AA, AAA |
| #767676 | 4.54:1 | AA only |
| #999999 | 2.85:1 | Fails |

---

## Resources

- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Colorable](https://colorable.jxnblk.com/)
- [Color Safe](http://colorsafe.co/)
- [Who Can Use](https://www.whocanuse.com/)
