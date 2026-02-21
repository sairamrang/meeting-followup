# Temenos UUX Design System - Components

## Overview

This document provides guidelines for component usage, sizing, states, and behavior within the UUX design system. All components are designed to work together cohesively while maintaining accessibility and usability standards.

---

## Component Density

Components are available in different sizes to match layout density modes:

### Density Mode Mapping

| Density Mode | Component Size | Typical Use Case |
|--------------|---------------|------------------|
| **Standard** | Medium/X-Large | Desktop applications |
| **Compact** | Small/Large | Mobile devices, dense UIs |

**Rule - Component Density:**
- Use **Standard (Medium)** components in standard density layouts
- Use **Compact (Small)** components in compact density layouts

---

## Component Sizing Reference

### Input Components

Input components include text fields, dropdowns, date pickers, and similar form elements.

| Component | Standard Density | Compact Density |
|-----------|-----------------|-----------------|
| **Text Field** | Medium (56px height) | Small (40px height) |
| **Dropdown** | Medium (56px height) | Small (40px height) |
| **Date Picker** | Medium (56px height) | Small (40px height) |
| **Text Area** | Medium base height | Small base height |

### Group Components

Group components include radio groups, checkbox groups, and similar multi-option elements.

| Component | Standard Density | Compact Density |
|-----------|-----------------|-----------------|
| **Radio Group** | Medium (40px per item) | Small (32px per item) |
| **Checkbox Group** | Medium (40px per item) | Small (32px per item) |

### Buttons

| Button Type | Standard Density | Compact Density |
|-------------|-----------------|-----------------|
| **CTA (Primary)** | X-Large (48px height) | Large (40px height) |
| **Outlined (Secondary)** | X-Large (48px height) | Large (40px height) |
| **Text Button** | X-Large (48px height) | Large (40px height) |

---

## Component States

All interactive components support multiple states to provide visual feedback:

### Common States

1. **Default/Rest** - Normal, inactive state
2. **Hover** - Mouse cursor over component
3. **Focus** - Component has keyboard focus
4. **Active/Pressed** - Component is being clicked/pressed
5. **Disabled** - Component is not interactive
6. **Error** - Validation has failed
7. **Success** - Validation has passed (when applicable)

### State Color Guidelines

| State | Color Palette | Typical Usage |
|-------|--------------|---------------|
| Default | Brand Primary | Interactive elements, CTAs |
| Hover | Brand Light (background) | Visual feedback on hover |
| Focus | Brand Primary (outline) | 2px outline for keyboard navigation |
| Disabled | Grayscale Light/Lightest | Non-interactive, greyed out |
| Error | Status Negative | Validation failures |
| Success | Status Positive | Validation success |

---

## Text Fields

Text fields allow users to enter and edit text.

### Specifications

| Density | Height | Label Size | Input Text Size |
|---------|--------|------------|----------------|
| Standard (Medium) | 56px | 12px (Small) | 14px (Body) |
| Compact (Small) | 40px | 12px (Small) | 14px (Body) |

### States

#### Default State
- Background: White or lightest brand color
- Border: 1px bottom line (`gray-light`)
- Label: `gray-primary`
- Text: `gray-dark`

#### Hover State
- Background: `brand-lightest`
- Border: 2px bottom line (`brand-primary`)

#### Focus State
- Background: White
- Border: 2px bottom line (`brand-primary`)
- Label: `brand-primary`

#### Error State
- Background: `status-negative-lightest`
- Border: 2px bottom line (`status-negative-primary`)
- Label: `status-negative-primary`
- Error message: `status-negative-primary`, 12px (Small), displayed below field

#### Disabled State
- Background: `gray-lightest`
- Border: 1px bottom line (`gray-light`)
- Label: `gray-light`
- Text: `gray-light`

### Error Handling

**Rule - Text Field Validation:**

On validation failure:
1. Change background color to `status-negative-lightest`
2. Change activation indicator color to `status-negative-primary`
3. Display error text beneath the activation indicator

On hover (with error):
4. Change activation indicator line width to 2px

### Spacing

- **Bottom padding:** 2G (16px) for error message space
- **Bottom margin:** 1G (8px)
- **Total vertical spacing:** 3G without error, 1G + error height with error

---

## Radio Buttons & Radio Groups

Radio buttons allow users to select one option from a set.

### Radio Button Specifications

| Density | Button Size | Label Size | Item Height |
|---------|------------|------------|-------------|
| Standard (Medium) | 20px | 14px (Body) | 40px |
| Compact (Small) | 16px | 14px (Body) | 32px |

### Radio Button States

#### Default State
- Outer ring: 2px stroke, `brand-primary`
- Inner circle: None (when unselected)
- Label: `gray-dark`

#### Selected State
- Outer ring: 2px stroke, `brand-primary`
- Inner circle: Filled, `brand-primary`
- Label: `gray-dark`

#### Hover State
- Visual feedback: `brand-lightest` background circle (24px diameter)
- Outer ring: `brand-primary`

#### Error State
- Outer ring: `status-negative-primary`
- Inner circle (if selected): `status-negative-primary`
- Hover feedback background: `status-negative-lightest`

#### Disabled State
- Outer ring: `gray-light`
- Inner circle (if selected): `gray-light`
- Label: `gray-light`

### Radio Group

**Rule - Radio Group Validation:**

On validation failure:
1. Apply radio button error styling to all buttons in group
2. Display error text beside the group label (left side in LTR)
3. Use `status-negative-primary` for error text

---

## Checkboxes & Checkbox Groups

Checkboxes allow users to select multiple options from a set.

### Checkbox Specifications

| Density | Box Size | Label Size | Item Height |
|---------|----------|------------|-------------|
| Standard (Medium) | 18px | 14px (Body) | 40px |
| Compact (Small) | 16px | 14px (Body) | 32px |

### Checkbox States

#### Default State (Unchecked)
- Border: 2px stroke, `brand-primary`
- Background: White
- Label: `gray-dark`

#### Checked State
- Border: 2px stroke, `brand-primary`
- Background: `brand-primary`
- Checkmark: White
- Label: `gray-dark`

#### Indeterminate State
- Border: 2px stroke, `brand-primary`
- Background: `brand-primary`
- Dash mark: White (horizontal line)

#### Hover State
- Visual feedback: `brand-lightest` background circle (24px diameter)

#### Error State
- Border and background: `status-negative-primary`
- Checkmark/dash: White
- Hover feedback background: `status-negative-lightest`

#### Disabled State
- Border: `gray-light`
- Background (if checked): `gray-light`
- Label: `gray-light`

### Checkbox Group

**Rule - Checkbox Group Validation:**

On validation failure:
1. Apply checkbox error styling to all checkboxes in group
2. Display error text beside the group label (left side in LTR)
3. Use `status-negative-primary` for error text

---

## Buttons

Buttons allow users to take actions with a single tap or click.

### Button Types

1. **CTA (Primary)** - Filled, high emphasis
2. **Outlined (Secondary)** - Stroke outline, medium emphasis
3. **Text (Low)** - No container, low emphasis

### CTA Button (Primary)

| Density | Size | Height | Padding |
|---------|------|--------|---------|
| Standard | X-Large | 48px | 16px horizontal |
| Compact | Large | 40px | 16px horizontal |

#### States

**Default:**
- Background: `brand-primary`
- Text: White
- Border: None

**Hover:**
- Background: `brand-dark`
- Text: White
- Elevation: Slight shadow

**Pressed:**
- Background: `brand-darkest`
- Text: White

**Disabled:**
- Background: `gray-lightest`
- Text: `gray-light`

### Outlined Button (Secondary)

| Density | Size | Height | Padding |
|---------|------|--------|---------|
| Standard | X-Large | 48px | 16px horizontal |
| Compact | Large | 40px | 16px horizontal |

#### States

**Default:**
- Background: White/Transparent
- Text: `brand-primary`
- Border: 1px, `brand-primary`

**Hover:**
- Background: `brand-lightest`
- Text: `brand-primary`
- Border: 1px, `brand-primary`

**Pressed:**
- Background: `brand-light`
- Text: `brand-dark`
- Border: 1px, `brand-dark`

**Disabled:**
- Background: Transparent
- Text: `gray-light`
- Border: 1px, `gray-light`

### Button Placement

**Form Buttons:**
- Place at bottom of form
- Primary button on right (LTR), left (RTL)
- Secondary button to left of primary
- Spacing between buttons: 2G (16px)

**Dialog Buttons:**
- Place at bottom right of dialog
- Same ordering as form buttons

---

## Dropdowns / Select

Dropdowns allow users to select one option from a list.

### Specifications

| Density | Height | Label Size | Selected Text Size |
|---------|--------|------------|-------------------|
| Standard (Medium) | 56px | 12px (Small) | 14px (Body) |
| Compact (Small) | 40px | 12px (Small) | 14px (Body) |

### States

Similar to text fields with these additions:

**Default:**
- Dropdown icon: `gray-primary`, 24px
- Selected text: `gray-dark`

**Open/Expanded:**
- Dropdown panel: White background, elevation shadow
- Options: 48px height (standard), 40px (compact)
- Selected option: `brand-lightest` background

**Hover (option):**
- Background: `brand-lightest`

---

## Cards

Cards are containers for related content and actions.

### Specifications

| Density | Padding | Border Radius | Elevation |
|---------|---------|--------------|-----------|
| Standard | 3G (24px) | 4px | 2dp shadow |
| Compact | 2G (16px) | 4px | 2dp shadow |

### Structure

1. **Card Title** (H2) - Optional
2. **Card Content** - Main content area with fieldsets
3. **Card Actions** - Optional button area at bottom

### Spacing

- **Padding:** 3G (standard) or 2G (compact) on all sides
- **Bottom padding:** 4G includes space for last component's padding/margin
- **Margin between cards:** 3G (24px)

---

## Component Best Practices

### General Guidelines

1. **Match density** - Use consistent component sizing within a layout
2. **Provide feedback** - Show hover, focus, and active states
3. **Show errors clearly** - Use Status Negative palette for errors
4. **Maintain touch targets** - Minimum 40px × 40px for interactive elements
5. **Label clearly** - Every input should have a clear label
6. **Group logically** - Use radio/checkbox groups for related options
7. **Disable vs hide** - Disable when action is temporarily unavailable, hide if never applicable

### Accessibility

- **Keyboard navigation:** All components must be keyboard accessible
- **Focus indicators:** Always visible (2px outline, `brand-primary`)
- **Touch targets:** Minimum 40px × 40px (48px recommended)
- **Color contrast:** Meet WCAG AA requirements (see [06-accessibility.md](06-accessibility.md))
- **Error messages:** Announced by screen readers
- **Labels:** Associated with inputs via proper markup

### Validation

1. **Validate on blur** - Check field when user leaves it
2. **Validate on submit** - Check all fields on form submission
3. **Show errors clearly** - Use error state and message
4. **Be specific** - Error messages should explain what's wrong
5. **Clear errors** - Remove error state once corrected

---

## Implementation Examples

### Text Field with Error

```html
<div class="form-field">
  <label for="email">Email Address</label>
  <input
    type="email"
    id="email"
    class="text-field error"
    aria-invalid="true"
    aria-describedby="email-error"
  >
  <span id="email-error" class="error-message">
    Please enter a valid email address
  </span>
</div>
```

### Radio Group

```html
<fieldset class="radio-group">
  <legend>Select an option</legend>
  <label>
    <input type="radio" name="option" value="1">
    Option 1
  </label>
  <label>
    <input type="radio" name="option" value="2">
    Option 2
  </label>
</fieldset>
```

### Button Group

```html
<div class="button-group">
  <button class="btn btn-outlined">Cancel</button>
  <button class="btn btn-cta">Save</button>
</div>
```

---

## References

- [Material Design - Components](https://material.io/components)
- See also: [02-colors.md](02-colors.md) for color specifications
- See also: [04-layout-spacing.md](04-layout-spacing.md) for spacing guidelines
- See also: [06-accessibility.md](06-accessibility.md) for accessibility requirements
