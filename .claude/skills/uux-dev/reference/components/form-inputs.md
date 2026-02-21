# Form Inputs

Form input components provide data entry and user input capabilities. All components support two density modes (Standard: 56px height, Compact: 40px height) and include built-in validation.

## Components Overview

| Component | Tag | Primary Use |
|-----------|-----|-------------|
| Text Field | `<uwc-text-field>` | Single-line text input |
| Text Area | `<uwc-text-area>` | Multi-line text input |
| Text | `<uwc-text>` | Read-only formatted text display |
| Select | `<uwc-select>` | Dropdown selection from list |
| Autocomplete | `<uwc-autocomplete>` | Searchable dropdown with filtering |
| Combobox | `<uwc-combobox>` | Select with custom input option |
| Checkbox | `<uwc-checkbox>` | Single binary choice |
| Checkbox Group | `<uwc-checkbox-group>` | Multiple independent selections |
| Radio Group | `<uwc-radio-group>` | Single selection from mutually exclusive options |
| Switch | `<uwc-switch>` | Toggle on/off state |
| Date Picker | `<uwc-date-picker>` | Simple date selection |
| Date Calendar | `<uwc-date-calendar>` | Inline calendar display |
| Amount Field | `<uwc-amount-field>` | Currency/monetary value input |
| File Upload | `<uwc-file-upload>` | File selection button |

---

## uwc-text-field

Single-line text input with label, validation, and optional leading/trailing icons.

### Key Features
- Optional label (floating or fixed)
- Leading and trailing icons
- Helper text and error messages
- Real-time validation
- Input types: text, email, tel, url, password, number
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Single-line text entry (names, emails, phone numbers)
- Structured data input with validation
- Search fields

### Example
```html
<!-- Basic text field -->
<uwc-text-field
  label="Email Address"
  type="email"
  required
  validationMessage="Please enter a valid email">
</uwc-text-field>

<!-- With leading icon -->
<uwc-text-field
  label="Search"
  leadingIcon="search"
  placeholder="Search products...">
</uwc-text-field>

<!-- With trailing icon (action) -->
<uwc-text-field
  label="Password"
  type="password"
  trailingIcon="visibility"
  required>
</uwc-text-field>

<!-- Compact density -->
<uwc-text-field
  label="Username"
  density="compact">
</uwc-text-field>
```

### Related Components
- [Text Area](#uwc-text-area) - Multi-line text input
- [Autocomplete](#uwc-autocomplete) - Text field with suggestions

---

## uwc-text-area

Multi-line text input for longer content entry.

### Key Features
- Expandable/resizable text area
- Character counter
- Optional min/max rows
- Helper text and validation
- Two density modes

### Density Modes
- **Standard** (desktop): Initial height based on rows
- **Compact** (mobile): Reduced padding

### When to Use
- Long-form text entry (comments, descriptions, notes)
- Multi-line data (addresses, feedback)

### Example
```html
<!-- Basic text area -->
<uwc-text-area
  label="Comments"
  rows="4"
  placeholder="Enter your comments here...">
</uwc-text-area>

<!-- With character limit -->
<uwc-text-area
  label="Description"
  maxlength="500"
  showCounter
  helperText="Maximum 500 characters">
</uwc-text-area>

<!-- Required with validation -->
<uwc-text-area
  label="Feedback"
  required
  minlength="10"
  validationMessage="Please provide at least 10 characters">
</uwc-text-area>
```

### Related Components
- [Text Field](#uwc-text-field) - Single-line text input

---

## uwc-text ✅ Validated 2025-01-21

Read-only formatted text display component with typography variants.

### Key Features
- Display-only text with consistent typography
- Multiple text variants (h1-h6, body, small, caption)
- Emphasis levels (high, medium, low)
- Color theming support
- Responsive typography

### Typography Variants
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Heading levels
- `body` - Default body text
- `small` - Small text
- `caption` - Caption text

### Emphasis Levels
- `high` - High emphasis (default)
- `medium` - Medium emphasis
- `low` - Low emphasis

### When to Use
- Display formatted text with consistent typography
- Headings and subheadings
- Body text and captions
- Themed text content

### Example
```html
<!-- Heading variants -->
<uwc-text variant="h1">Main Heading</uwc-text>
<uwc-text variant="h2">Section Heading</uwc-text>

<!-- Body text with emphasis -->
<uwc-text variant="body" emphasis="high">Important body text</uwc-text>
<uwc-text variant="body" emphasis="medium">Normal body text</uwc-text>
<uwc-text variant="body" emphasis="low">Secondary text</uwc-text>

<!-- Small text with color -->
<uwc-text variant="small" emphasis="high" color="temenos-dark">
  Small dark text
</uwc-text>

<!-- Caption text -->
<uwc-text variant="caption" emphasis="low">
  Caption or helper text
</uwc-text>
```

**Important**: `uwc-text` is for typography styling, NOT for read-only form field display. Use `<uwc-text-field disabled>` for form field displays.

### Related Components
- [Text Field](#uwc-text-field) - Editable text input

---

## uwc-select

Dropdown selection component for choosing from a predefined list.

### Key Features
- Single selection from dropdown
- Optional search/filter
- Grouped options support
- Validation support
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Select from 5-20 predefined options
- Categorized options
- Country, state, or region selection

### Example

> **⚠️ IMPORTANT - Value Binding with UWC CDN:**
> When using UWC from CDN and you need to **programmatically set/bind the selected value** (e.g., `.value=${this.selectedValue}`), you MUST use the **`.options` property** approach. Child `<uwc-list-item>` elements work for static dropdowns but don't reliably display the selected value when bound via `.value`.

**Recommended: Using `.options` Property (Best for value binding)**
```html
<!-- Plain HTML with JSON string -->
<uwc-select
  label="Country"
  value="US"
  options='[{"label":"Select a country","value":""},{"label":"United States","value":"US"},{"label":"United Kingdom","value":"UK"},{"label":"Canada","value":"CA"}]'
  required>
</uwc-select>

<!-- Lit with property binding - RECOMMENDED for dynamic values -->
<uwc-select
  .label=${'Product Category'}
  .value=${this.selectedCategory}
  .options=${[
    { label: 'Phones', value: 'phone' },
    { label: 'Laptops', value: 'laptop' },
    { label: 'Shirts', value: 'shirt' },
    { label: 'Pants', value: 'pants' }
  ]}
  @change=${(e: Event) => {
    const target = e.target as any;
    this.selectedCategory = target.value;
  }}>
</uwc-select>

<!-- Dynamic options from array -->
<uwc-select
  .label=${'Account'}
  .value=${this.selectedAccountId}
  .options=${[
    { label: 'All Accounts', value: '' },
    ...this.accounts.map(account => ({
      label: account.name,
      value: account.id
    }))
  ]}
  @change=${this.handleAccountChange}>
</uwc-select>
```

**Alternative: Child `<uwc-list-item>` Elements (Static only)**
```html
<!-- Works for static dropdowns without value binding -->
<uwc-select label="Status" density="compact">
  <uwc-list-item value="active">Active</uwc-list-item>
  <uwc-list-item value="inactive">Inactive</uwc-list-item>
</uwc-select>

<!-- ⚠️ NOT RECOMMENDED: Value binding with child elements may not display -->
<uwc-select label="Country" .value=${this.selectedCountry}>
  <uwc-list-item value="US">United States</uwc-list-item>
  <uwc-list-item value="UK">United Kingdom</uwc-list-item>
</uwc-select>
<!-- ^ Selected value may not show in closed dropdown! Use .options instead -->
```

**Important Notes:**
- Always use `<uwc-list-item>` elements (NOT native `<option>` elements) if using child elements
- For **programmatic value binding** (`.value=${...}`), use the **`.options` property** approach
- Child elements work for **static dropdowns** where the value never changes programmatically
- The `.options` property approach is more reliable with UWC CDN

### Related Components
- [Autocomplete](#uwc-autocomplete) - Select with search
- [Combobox](#uwc-combobox) - Select with custom input
- [Radio Group](#uwc-radio-group) - For 2-5 mutually exclusive options

---

## uwc-autocomplete ✅ Validated 2025-01-21

Searchable dropdown with API-based filtering and suggestions.

### Key Features
- Type-ahead search with API integration
- Dynamic filtered suggestions from server
- Keyboard navigation
- Configurable field mapping for API responses
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Large datasets requiring server-side search (100+ items)
- Entity/user lookup from API
- Location/address search
- Product/catalog search

### Example

**IMPORTANT**: `uwc-autocomplete` is designed for **API-based suggestions**, not static options.

```html
<!-- API-based autocomplete -->
<uwc-autocomplete
  label="Search Entities"
  suggestionsApiSearchUrl="https://api.example.com/entities?search="
  apiResponseSuggestionLabelFieldname="name"
  apiResponseSuggestionValueFieldname="id">
</uwc-autocomplete>

<!-- With custom field mapping -->
<uwc-autocomplete
  label="Search Products"
  placeholder="Type to search..."
  suggestionsApiSearchUrl="https://api.example.com/products?q="
  apiResponseSuggestionLabelFieldname="productName"
  apiResponseSuggestionValueFieldname="productId">
</uwc-autocomplete>
```

**How it works:**
1. User types in the field
2. Component calls `suggestionsApiSearchUrl` + user input
3. API returns JSON array of objects
4. Component displays suggestions using specified field names
5. Selected value is the value from `apiResponseSuggestionValueFieldname`

### Related Components
- [Select](#uwc-select) - Dropdown without search
- [Combobox](#uwc-combobox) - Autocomplete with custom input
- [Text Field](#uwc-text-field) - Basic text input

---

## uwc-combobox ✅ Validated 2025-01-21

Combination of select dropdown and custom text input allowing both selection and free-form entry.

### Key Features
- Select from predefined list OR enter custom value
- Filtered dropdown suggestions
- Free-form text entry allowed
- Client-side filtering
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Most common options provided, but custom entry allowed
- "Other" option scenarios
- Flexible category/tag selection
- Small to medium static lists (5-50 items)

### Example

**IMPORTANT**: `uwc-combobox` uses `.options` property, NOT attributes or child elements.

```html
<!-- Combobox element -->
<uwc-combobox id="deptCombo" label="Department"></uwc-combobox>
```

```typescript
// Set options via JavaScript property
const comboEl = document.getElementById("deptCombo");
comboEl.options = [
  "Engineering",
  "Sales",
  "Marketing",
  "Support",
  "Finance"
];
```

**Lit Component Example:**
```typescript
// In your Lit component
render() {
  const departments = ["Engineering", "Sales", "Marketing", "Support"];

  return html`
    <uwc-combobox
      id="dept"
      label="Department"
      .options=${departments}>
    </uwc-combobox>
  `;
}
```

**With validation:**
```html
<uwc-combobox
  id="productCombo"
  label="Product Name"
  required
  helperText="Select or enter a product name">
</uwc-combobox>
```

### Related Components
- [Autocomplete](#uwc-autocomplete) - Search-only, no custom input
- [Select](#uwc-select) - Predefined options only

---

## uwc-checkbox

Single binary choice control.

### Key Features
- On/off binary state
- Optional indeterminate state
- Label positioning (left/right)
- Validation support
- Two density modes (Standard: 24px, Compact: 18px)

### Density Modes
- **Standard** (desktop): 24px checkbox size
- **Compact** (mobile): 18px checkbox size

### When to Use
- Single yes/no decision
- Terms acceptance
- Feature toggles
- Independent boolean options

### Example
```html
<!-- Basic checkbox -->
<uwc-checkbox
  label="I agree to the terms and conditions"
  required>
</uwc-checkbox>

<!-- Pre-checked -->
<uwc-checkbox
  label="Send me email notifications"
  checked>
</uwc-checkbox>

<!-- Indeterminate state -->
<uwc-checkbox
  label="Select all"
  indeterminate>
</uwc-checkbox>

<!-- Compact density -->
<uwc-checkbox
  label="Remember me"
  density="compact">
</uwc-checkbox>
```

### Related Components
- [Switch](#uwc-switch) - Toggle for on/off states
- [Checkbox Group](#uwc-checkbox-group) - Multiple checkboxes

---

## uwc-checkbox-group ✅ Validated 2025-01-21

Multiple independent checkbox selections configured via `.options` property.

### Key Features
- Group multiple related checkboxes
- Programmatic configuration via `.options` property
- Group validation support
- Vertical or horizontal layout
- Two density modes (Standard: 24px, Compact: 18px)

### Density Modes
- **Standard** (desktop): 24px checkbox size
- **Compact** (mobile): 18px checkbox size

### When to Use
- Multiple independent selections
- Feature/permission selection
- Multi-category filtering

### Example

**IMPORTANT**: `uwc-checkbox-group` uses `.options` property, NOT child `<uwc-checkbox>` elements.

```html
<!-- Checkbox group element -->
<uwc-checkbox-group
  id="interestsGroup"
  name="interests"
  label="Select your interests"
  helperText="Choose all that apply">
</uwc-checkbox-group>
```

```typescript
// Set options via JavaScript property
const group = document.querySelector("#interestsGroup");
group.options = [
  { label: "Technology" },
  { label: "Sports" },
  { label: "Arts" },
  { label: "Music" }
];
```

**Lit Component Example:**
```typescript
// In your Lit component
render() {
  const interests = [
    { label: "Technology", value: "tech" },
    { label: "Sports", value: "sports" },
    { label: "Arts", value: "arts" },
    { label: "Music", value: "music" }
  ];

  return html`
    <uwc-checkbox-group
      name="interests"
      label="Select your interests"
      .options=${interests}>
    </uwc-checkbox-group>
  `;
}
```

**With validation:**
```html
<uwc-checkbox-group
  id="notifGroup"
  label="Notification preferences"
  helperText="Select at least one"
  required>
</uwc-checkbox-group>
<script>
  document.querySelector("#notifGroup").options = [
    { label: "Email" },
    { label: "SMS" },
    { label: "Push Notifications" }
  ];
</script>
```

### Related Components
- [Checkbox](#uwc-checkbox) - Single checkbox
- [Chip Group](buttons-actions.md#uwc-chip-group) - Visual multi-select alternative

---

## uwc-radio-group ✅ Validated 2025-01-21

Single selection from mutually exclusive options configured via `.options` property.

### Key Features
- Single selection (mutually exclusive)
- Programmatic configuration via `.options` property
- Required validation
- Vertical or horizontal layout
- Two density modes (Standard: 24px, Compact: 18px)

### Density Modes
- **Standard** (desktop): 24px radio button size
- **Compact** (mobile): 18px radio button size

### When to Use
- Mutually exclusive choices (2-5 options)
- Required single selection
- Payment method, shipping method selection

### Example

**IMPORTANT**: `uwc-radio-group` uses `.options` property, NOT child `<uwc-radio>` elements.

```html
<!-- Radio group element -->
<uwc-radio-group
  id="shippingGroup"
  label="Shipping Method">
</uwc-radio-group>
```

```typescript
// Set options via JavaScript property
const group = document.querySelector("#shippingGroup");
group.options = [
  { label: "Standard (5-7 days)" },
  { label: "Express (2-3 days)" },
  { label: "Overnight" }
];
```

**Lit Component Example:**
```typescript
// In your Lit component
render() {
  const paymentMethods = [
    { label: "Credit Card", value: "card" },
    { label: "PayPal", value: "paypal" },
    { label: "Bank Transfer", value: "bank" }
  ];

  return html`
    <uwc-radio-group
      label="Payment Method"
      .options=${paymentMethods}>
    </uwc-radio-group>
  `;
}
```

**With pre-selected value:**
```html
<uwc-radio-group
  id="genderGroup"
  label="Gender"
  value="other">
</uwc-radio-group>
<script>
  document.querySelector("#genderGroup").options = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" }
  ];
</script>
```

### Related Components
- [Select](#uwc-select) - For 5+ mutually exclusive options
- [Button Toggle](buttons-actions.md#uwc-button-toggle) - Visual alternative for 2-4 options

---

## uwc-switch

Toggle control for on/off states.

### Key Features
- Clear on/off visual state
- Optional labels
- Instant state change
- Two density modes (Standard: 34x14px, Compact: 28x12px)

### Density Modes
- **Standard** (desktop): 34x14px switch size
- **Compact** (mobile): 28x12px switch size

### When to Use
- Enable/disable features
- Settings and preferences
- Immediate effect toggles (no form submission needed)

### Example
```html
<!-- Basic switch -->
<uwc-switch
  label="Enable notifications">
</uwc-switch>

<!-- Pre-enabled -->
<uwc-switch
  label="Dark mode"
  checked>
</uwc-switch>

<!-- With helper text -->
<uwc-switch
  label="Auto-save"
  helperText="Automatically save your progress">
</uwc-switch>

<!-- Compact density -->
<uwc-switch
  label="Compact view"
  density="compact">
</uwc-switch>
```

### Related Components
- [Checkbox](#uwc-checkbox) - For binary choices in forms
- [Button Toggle](buttons-actions.md#uwc-button-toggle) - For 2+ mutually exclusive states

---

## uwc-date-picker

Simple date selection with calendar popup.

### Key Features
- Text input with calendar icon
- Calendar popup dialog
- Date format configuration
- Min/max date restrictions
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Simple date selection (birth date, appointment date)
- Single date without complex requirements
- Most common date input scenario

**For more complex date scenarios, see [Date & Time Components](date-time.md)**

### Example
```html
<!-- Basic date picker -->
<uwc-date-picker
  label="Birth Date"
  required>
</uwc-date-picker>

<!-- With min/max dates -->
<uwc-date-picker
  label="Appointment Date"
  min="2025-01-01"
  max="2025-12-31"
  required>
</uwc-date-picker>

<!-- Custom format -->
<uwc-date-picker
  label="Start Date"
  format="MM/DD/YYYY">
</uwc-date-picker>

<!-- Compact density -->
<uwc-date-picker
  label="Date"
  density="compact">
</uwc-date-picker>
```

### Related Components
- [Date Calendar](#uwc-date-calendar) - Inline calendar
- [Date Range Picker](date-time.md#uwc-date-range-picker) - Start and end dates
- [Date Relative Picker](date-time.md#uwc-date-relative-picker) - Fixed or relative dates
- All other [Date & Time Components](date-time.md)

---

## uwc-date-calendar

Inline calendar component for date selection.

### Key Features
- Always-visible calendar
- No popup dialog
- Month/year navigation
- Highlighted today/selected dates
- Two density modes

### Density Modes
- **Standard** (desktop): ~320px width
- **Compact** (mobile): ~280px width

### When to Use
- Date selection where space allows inline display
- Dashboard date selection
- Embedded in larger forms/layouts

### Example
```html
<!-- Basic inline calendar -->
<uwc-date-calendar
  value="2025-10-17">
</uwc-date-calendar>

<!-- With min/max dates -->
<uwc-date-calendar
  min="2025-01-01"
  max="2025-12-31">
</uwc-date-calendar>

<!-- Multiple date selection -->
<uwc-date-calendar
  multiple
  maxSelections="5">
</uwc-date-calendar>
```

### Related Components
- [Date Picker](#uwc-date-picker) - Text field with calendar popup

---

## uwc-amount-field

Specialized input for currency and monetary values.

### Key Features
- Automatic currency formatting
- Configurable currency symbol
- Decimal precision control
- Thousands separator
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Monetary value input
- Financial transactions
- Pricing, budgets, salaries

### Example
```html
<!-- Basic amount field -->
<uwc-amount-field
  label="Loan Amount"
  currency="USD"
  required>
</uwc-amount-field>

<!-- With min/max -->
<uwc-amount-field
  label="Transfer Amount"
  currency="EUR"
  min="10"
  max="10000"
  required>
</uwc-amount-field>

<!-- Custom precision -->
<uwc-amount-field
  label="Price"
  currency="GBP"
  precision="3">
</uwc-amount-field>

<!-- Compact density -->
<uwc-amount-field
  label="Amount"
  currency="USD"
  density="compact">
</uwc-amount-field>
```

### Related Components
- [Text Field](#uwc-text-field) - General text input
- [Hierarchy Field](specialized-enterprise.md#uwc-hierarchy-field) - Financial entity hierarchy

---

## uwc-file-upload

File selection button with drag-drop support.

### Key Features
- Button-based file selection
- Multiple file selection
- File type restrictions
- File size validation
- Two density modes (Standard: 40px button, Compact: 32px button)

### Density Modes
- **Standard** (desktop): 40px button height
- **Compact** (mobile): 32px button height

### When to Use
- Document upload (resumes, contracts)
- Image upload (profile pictures, attachments)
- Any file upload scenario

### Example
```html
<!-- Basic file upload -->
<uwc-file-upload
  label="Upload Resume"
  accept=".pdf,.doc,.docx"
  required>
</uwc-file-upload>

<!-- Multiple files -->
<uwc-file-upload
  label="Upload Images"
  accept="image/*"
  multiple
  maxFiles="5">
</uwc-file-upload>

<!-- With size limit -->
<uwc-file-upload
  label="Attach Documents"
  maxSize="10485760"
  helperText="Maximum 10MB per file">
</uwc-file-upload>
```

### Related Components
- [File Drag-Drop Area](specialized-enterprise.md#uwc-file-dragdrop-area) - Full drag-drop zone

---

## Best Practices

### Validation
- Use `required` attribute for mandatory fields
- Provide clear `validationMessage` text
- Use real-time validation for better UX
- Show error messages below fields

### Labels
- Always provide descriptive labels
- Use placeholder text sparingly (not a substitute for labels)
- Keep labels concise (1-3 words)

### Density Selection
- Use **Standard** density for desktop applications
- Use **Compact** density for mobile/tablet or high-density interfaces
- Maintain consistent density within a form

### Component Selection
- **Text Field** vs **Text Area**: Single line vs multi-line
- **Select** vs **Autocomplete**: Small list (5-20) vs large list (20+)
- **Radio Group** vs **Select**: 2-5 visible options vs dropdown
- **Checkbox** vs **Switch**: Form submission vs immediate effect
- **Date Picker** vs **Date Calendar**: Popup vs inline

### Accessibility
- Ensure all inputs have associated labels
- Use appropriate input types for mobile keyboards
- Provide clear error messages
- Support keyboard navigation
- Test with screen readers
