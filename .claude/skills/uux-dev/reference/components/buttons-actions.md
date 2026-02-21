# Buttons & Actions

Components for triggering user actions and selections.

## Components Overview

| Component | Tag | Primary Use |
|-----------|-----|-------------|
| Button | `<uwc-button>` | Primary action triggers |
| Icon Button | `<uwc-icon-button>` | Icon-only action buttons |
| Button Toggle | `<uwc-button-toggle>` | Toggle button group for mutually exclusive options |
| Chip Group | `<uwc-chip-group>` | Multi-select filter/tag group |

---

## uwc-button

Standard action button with multiple variants and states.

### Key Features
- Multiple variants (filled, outlined, text)
- Leading and trailing icons
- Disabled state
- Loading state
- Full-width option
- Two density modes (Standard: 40px height, Compact: 32px height)

### Density Modes
- **Standard** (desktop): 40px height
- **Compact** (mobile): 32px height

### Button Variants
- **Contained**: High emphasis, primary actions (boolean attribute)
- **Outlined**: Medium emphasis, secondary actions (boolean attribute)
- **CTA**: Call-to-action, highest emphasis (boolean attribute)
- **Standard** (default): Low emphasis, tertiary actions (no attribute)

### When to Use
- Submit forms
- Trigger actions
- Navigate to pages
- Confirm/cancel operations
- Primary user interactions

### Example
```html
<!-- Contained button (primary) -->
<uwc-button contained label="Save Changes"></uwc-button>

<!-- Outlined button (secondary) -->
<uwc-button outlined label="Cancel"></uwc-button>

<!-- CTA button (call-to-action) -->
<uwc-button cta label="Get Started"></uwc-button>

<!-- Standard button (tertiary) - no attribute -->
<uwc-button label="Learn More"></uwc-button>

<!-- With icon -->
<uwc-button contained icon="save" label="Save"></uwc-button>

<!-- With trailing icon (using trailingIcon) -->
<uwc-button outlined trailingIcon="arrow_forward" label="Next Step"></uwc-button>

<!-- Disabled state -->
<uwc-button contained disabled label="Unavailable"></uwc-button>

<!-- With click handler in Lit -->
<uwc-button
  contained
  label="Submit"
  @click=${this.handleSubmit}>
</uwc-button>

<!-- Icon-only button (use icon attribute, no label) -->
<uwc-button contained icon="edit"></uwc-button>

<!-- Size variants -->
<uwc-button contained size="small" label="Small"></uwc-button>
<uwc-button contained size="medium" label="Medium"></uwc-button>
<uwc-button contained size="large" label="Large"></uwc-button>
<uwc-button contained size="extraLarge" label="Extra Large"></uwc-button>
```

**Important**: Always use the `label="..."` attribute for button text. Do NOT use boolean attributes `contained`, `outlined`, or `cta` - these are mutually exclusive. Use only one per button.

### Best Practices
- One primary action per screen (contained or CTA button)
- Limit to 1-3 buttons in a group
- Order: Cancel/Secondary (left), Primary (right)
- Use icons for clarity, not decoration
- Clear, action-oriented labels (verbs)
- Consistent button placement across app
- Always use `label="..."` attribute for button text

### Button Hierarchy
1. **CTA** - Highest emphasis, main call-to-action (Get Started, Sign Up)
2. **Contained** - High emphasis, primary action (Save, Submit, Continue)
3. **Outlined** - Medium emphasis, secondary action (Cancel, Back, Reset)
4. **Standard** - Low emphasis, tertiary action (Learn More, Skip, View Details)

### Accessibility
- Use semantic `<button>` or `<a>` elements
- Provide descriptive labels
- Support keyboard (Enter/Space)
- Clear focus indicators
- Loading state announced to screen readers
- Disabled buttons not in tab order

### Related Components
- [Icon Button](#uwc-icon-button) - Icon-only buttons
- [Button Toggle](#uwc-button-toggle) - Toggle group
- [Menu Button](navigation.md#uwc-menu-button) - Button with menu

---

## uwc-icon-button

Icon-only button for compact action triggers.

### Key Features
- Icon-only display
- Multiple variants (filled, outlined, standard)
- Disabled state
- Tooltip support
- Two density modes (Standard: 40px, Compact: 32px)

### Density Modes
- **Standard** (desktop): 40px diameter
- **Compact** (mobile): 32px diameter

### When to Use
- Toolbar actions
- Table row actions
- Compact action areas
- Well-known actions (search, close, menu)
- Space-constrained layouts

### Example
```html
<!-- Basic icon button -->
<uwc-icon-button icon="edit">
</uwc-icon-button>

<!-- With tooltip (required for accessibility) -->
<uwc-icon-button icon="delete" ariaLabel="Delete item">
  <uwc-tooltip>Delete</uwc-tooltip>
</uwc-icon-button>

<!-- Filled variant -->
<uwc-icon-button icon="favorite" variant="filled">
</uwc-icon-button>

<!-- Outlined variant -->
<uwc-icon-button icon="share" variant="outlined">
</uwc-icon-button>

<!-- Disabled state -->
<uwc-icon-button icon="save" disabled>
</uwc-icon-button>

<!-- Compact density -->
<uwc-icon-button icon="close" density="compact">
</uwc-icon-button>

<!-- Toggle state (favorite) -->
<uwc-icon-button
  icon="favorite_border"
  selectedIcon="favorite"
  selected>
</uwc-icon-button>

<!-- As link -->
<uwc-icon-button icon="help" href="/help">
</uwc-icon-button>
```

### Common Icon Button Uses
- **Edit**: `edit` icon
- **Delete**: `delete` icon
- **Close**: `close` icon
- **Menu**: `menu` icon (hamburger)
- **Search**: `search` icon
- **Settings**: `settings` icon
- **More actions**: `more_vert` (vertical dots) or `more_horiz` (horizontal dots)
- **Favorite**: `favorite` / `favorite_border` (toggle)
- **Share**: `share` icon
- **Refresh**: `refresh` icon

### Best Practices
- Always provide `ariaLabel` attribute
- Use tooltips for clarity
- Use for universally recognized actions
- Don't use for primary actions
- Consistent icon usage across app
- 24px icons standard size
- Adequate touch target size (minimum 40px)

### Accessibility
- **CRITICAL**: Always provide `ariaLabel` or tooltip
- Support keyboard (Enter/Space)
- Clear focus indicators
- Use semantic HTML
- Don't rely on icon alone (provide text alternative)

### Related Components
- [Button](#uwc-button) - Text buttons
- [Tooltip](feedback-status.md#uwc-tooltip) - Icon button labels
- [Menu Button](navigation.md#uwc-menu-button) - Icon with dropdown

---

## uwc-button-toggle

Toggle button group for mutually exclusive options (like radio buttons, but visual).

### Key Features
- Single selection (mutually exclusive)
- 2-5 options
- Visual button group
- Horizontal layout
- Disabled state
- Two density modes (Standard: 40px height, Compact: 32px height)

### Density Modes
- **Standard** (desktop): 40px height
- **Compact** (mobile): 32px height

### When to Use
- 2-5 mutually exclusive choices
- Visual alternative to radio buttons
- View mode selection (list/grid)
- Formatting options (bold/italic/underline)
- Time period selection (day/week/month)

### Example

> **⚠️ IMPORTANT - UWC CDN Usage:**
> When using UWC components from CDN, you MUST use the `options` property, NOT child elements.
> The examples below show both plain HTML (with JSON string) and Lit (with property binding).

```html
<!-- Basic button toggle (plain HTML) -->
<uwc-button-toggle
  value="list"
  options='[{"label":"List","value":"list","icon":"view_list"},{"label":"Grid","value":"grid","icon":"view_module"}]'>
</uwc-button-toggle>

<!-- Time period selection (plain HTML) -->
<uwc-button-toggle
  value="week"
  options='[{"label":"Day","value":"day"},{"label":"Week","value":"week"},{"label":"Month","value":"month"},{"label":"Year","value":"year"}]'>
</uwc-button-toggle>

<!-- With disabled option (plain HTML) -->
<uwc-button-toggle
  options='[{"label":"Option 1","value":"option1"},{"label":"Option 2","value":"option2","disabled":true},{"label":"Option 3","value":"option3"}]'>
</uwc-button-toggle>

<!-- Compact density (plain HTML) -->
<uwc-button-toggle
  compact
  options='[{"label":"List","value":"list"},{"label":"Grid","value":"grid"}]'>
</uwc-button-toggle>
```

**Lit Element Example:**
```typescript
<!-- In Lit with property binding -->
<uwc-button-toggle
  .value=${this.selectedPeriod}
  .options=${[
    {label: 'Day', value: 'day'},
    {label: 'Week', value: 'week'},
    {label: 'Month', value: 'month'},
    {label: 'Year', value: 'year'}
  ]}
  @change=${(e: Event) => {
    // IMPORTANT: UWC button-toggle sends value via e.target.value, NOT e.detail.value
    const target = e.target as any;
    const selectedValue = target.value;
    this.handlePeriodChange(selectedValue);
  }}>
</uwc-button-toggle>
```

### Best Practices
- Use for 2-5 options (use Select for 6+)
- Equal width options when possible
- One option always selected
- Short option labels (1-2 words)
- Use icons for clarity when appropriate
- Consistent with radio button behavior

### When NOT to Use
- More than 5 options (use Select instead)
- Multi-select (use Chip Group instead)
- Binary on/off state (use Switch instead)

### Accessibility
- Use `role="radiogroup"`
- Provide `aria-label` for group
- Support arrow key navigation
- Indicate selected state with `aria-checked`
- Clear focus indicators

### Related Components
- [Radio Group](form-inputs.md#uwc-radio-group) - Non-visual mutually exclusive selection
- [Chip Group](#uwc-chip-group) - Multi-select alternative
- [Switch](form-inputs.md#uwc-switch) - Binary toggle
- [Tab Bar](navigation.md#uwc-tab-bar) - Content view switching

---

## uwc-chip-group

Multi-select group of chips (tags) for filtering or categorization.

### Key Features
- Multi-select (independent selections)
- Add/remove chips dynamically
- Filter chips (selectable)
- Input chips (with remove action)
- Choice chips (single/multi-select)
- Two density modes (Standard: 32px height, Compact: 24px height)

### Density Modes
- **Standard** (desktop): 32px chip height
- **Compact** (mobile): 24px chip height

### Chip Types
- **Filter chips**: Multi-select filters (e.g., categories, tags)
- **Input chips**: User-added tags (e.g., email recipients, keywords)
- **Choice chips**: Selection options (similar to checkbox group)

### When to Use
- Multi-category filtering
- Tag selection
- Keyword input
- Interest selection
- Multi-select categories

### Example

> **⚠️ IMPORTANT - UWC CDN Usage:**
> When using UWC components from CDN, you MUST use the `options` property, NOT child elements.
> The examples below show both plain HTML (with JSON string) and Lit (with property binding).

```html
<!-- Filter chips (multi-select) - plain HTML -->
<uwc-chip-group
  type="filter"
  options='[{"label":"Electronics","value":"electronics"},{"label":"Clothing","value":"clothing"},{"label":"Books","value":"books"},{"label":"Toys","value":"toys"}]'>
</uwc-chip-group>

<!-- Choice chips (single-select) - plain HTML -->
<uwc-chip-group
  type="choice"
  options='[{"label":"Air","value":"air","icon":"flight"},{"label":"Train","value":"train","icon":"train"},{"label":"Car","value":"car","icon":"directions_car"}]'>
</uwc-chip-group>

<!-- With pre-selected chips - plain HTML -->
<uwc-chip-group
  type="filter"
  selected='["electronics","books"]'
  options='[{"label":"Electronics","value":"electronics"},{"label":"Clothing","value":"clothing"},{"label":"Books","value":"books"}]'>
</uwc-chip-group>

<!-- Compact density - plain HTML -->
<uwc-chip-group
  type="filter"
  density="compact"
  options='[{"label":"Tag 1","value":"tag1"},{"label":"Tag 2","value":"tag2"},{"label":"Tag 3","value":"tag3"}]'>
</uwc-chip-group>

<!-- With disabled chips - plain HTML -->
<uwc-chip-group
  type="filter"
  options='[{"label":"Available","value":"available"},{"label":"Unavailable","value":"unavailable","disabled":true}]'>
</uwc-chip-group>
```

**Lit Element Example:**
```typescript
<!-- In Lit with property binding -->
<uwc-chip-group
  .type=${'filter'}
  .options=${[
    {label: 'Electronics', value: 'electronics'},
    {label: 'Clothing', value: 'clothing'},
    {label: 'Books', value: 'books'},
    {label: 'Toys', value: 'toys'}
  ]}
  @change=${(e: Event) => {
    // Check event structure - may vary by component
    // Some UWC components use e.detail, others use e.target
    const detail = (e as any).detail;
    const target = e.target as any;
    const selectedValue = detail?.value || target.value;
    this.handleCategoryChange(selectedValue);
  }}>
</uwc-chip-group>
```

### Best Practices
- Use for 5-20 options (few enough to scan)
- Keep chip labels short (1-2 words)
- Show selected count for many chips
- Allow "Clear all" for filter chips
- Wrap chips to multiple lines
- Visual selected state (filled background)

### Common Use Cases
- **E-commerce**: Category filters, price ranges, ratings
- **Content**: Tags, topics, keywords
- **Forms**: Interest selection, skill selection
- **Search**: Recent searches, suggested searches
- **Email**: To/CC recipients

### Accessibility
- Use `role="listbox"` for chip group
- Provide `aria-label` for group
- Support keyboard navigation (Arrow keys, Space to toggle)
- Announce selection changes
- Clear focus indicators
- Support Enter/Delete for removal

### Related Components
- [Checkbox Group](form-inputs.md#uwc-checkbox-group) - Non-visual multi-select
- [Button Toggle](#uwc-button-toggle) - Single-select toggle
- [Badge](feedback-status.md#uwc-badge) - Status indicator (non-interactive)

---

## Decision Matrix

| Scenario | Recommended Component |
|----------|----------------------|
| Primary form submission | [Button](#uwc-button) (filled variant) |
| Secondary form action (cancel, back) | [Button](#uwc-button) (outlined variant) |
| Tertiary action (learn more, skip) | [Button](#uwc-button) (text variant) |
| Toolbar actions with limited space | [Icon Button](#uwc-icon-button) |
| 2-5 mutually exclusive visual options | [Button Toggle](#uwc-button-toggle) |
| Multi-select filters or tags | [Chip Group](#uwc-chip-group) |
| Binary on/off state | [Switch](form-inputs.md#uwc-switch) |
| 2-5 mutually exclusive form options | [Radio Group](form-inputs.md#uwc-radio-group) |
| Dropdown actions menu | [Menu Button](navigation.md#uwc-menu-button) |

## Button Patterns

### Dialog Actions
```html
<div slot="actions">
  <uwc-button variant="text">Cancel</uwc-button>
  <uwc-button variant="filled">Confirm</uwc-button>
</div>
```

### Form Actions
```html
<div class="form-actions">
  <uwc-button type="reset" variant="outlined">Reset</uwc-button>
  <uwc-button type="submit" variant="filled" loadingIcon>Submit</uwc-button>
</div>
```

### Toolbar Actions
```html
<div class="toolbar">
  <uwc-icon-button icon="edit" ariaLabel="Edit"></uwc-icon-button>
  <uwc-icon-button icon="delete" ariaLabel="Delete"></uwc-icon-button>
  <uwc-icon-button icon="share" ariaLabel="Share"></uwc-icon-button>
</div>
```

### Filter Controls
```html
<!-- Using chip-group for multi-select filters -->
<uwc-chip-group
  type="filter"
  options='[{"label":"All","value":"all"},{"label":"Active","value":"active"},{"label":"Pending","value":"pending"},{"label":"Completed","value":"completed"}]'>
</uwc-chip-group>

<!-- OR using button-toggle for single-select filters -->
<uwc-button-toggle
  value="all"
  options='[{"label":"All","value":"all"},{"label":"Active","value":"active"},{"label":"Pending","value":"pending"},{"label":"Completed","value":"completed"}]'>
</uwc-button-toggle>
```

## Best Practices

### Button Hierarchy
- **1 primary action** per screen (filled button)
- **1-2 secondary actions** (outlined buttons)
- **Multiple tertiary actions** OK (text buttons)
- Icon buttons for toolbars and compact areas

### Button Labels
- Use action verbs (Save, Delete, Submit, Cancel)
- Be specific (Delete Account vs Delete)
- Keep short (1-3 words)
- Avoid generic labels (OK, Yes, No)

### Button Placement
- Primary action: Bottom-right (LTR) or right-most in group
- Cancel/Back: Left of primary action
- Destructive actions: Separated from primary, often with confirmation

### Loading States
- Show loading state for async operations
- Disable button during loading
- Replace label with loading indicator
- Re-enable when complete or on error

### Accessibility
- All buttons must be keyboard accessible
- Provide clear focus indicators
- Use semantic HTML (`<button>` vs `<div>`)
- Icon buttons must have `ariaLabel`
- Announce loading states to screen readers
- Adequate touch target size (minimum 40px)

### Mobile Considerations
- Use compact density for space-constrained layouts
- Ensure adequate touch target size (40px+)
- Consider full-width buttons on mobile
- Use icon buttons sparingly on mobile
- Consider sticky bottom button bar for primary actions
