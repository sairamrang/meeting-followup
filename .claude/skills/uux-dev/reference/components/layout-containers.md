# Layout & Containers

Components for page structure, content organization, and modal interactions.

## Components Overview

| Component | Tag | Primary Use |
|-----------|-----|-------------|
| Card | `<uwc-card>` | Content container with elevation |
| Expandable Card | `<uwc-expandable-card>` | Card with expand/collapse functionality |
| Expansion Panel | `<uwc-expansion-panel>` | Accordion-style collapsible panel |
| Dialog | `<uwc-dialog>` | Modal overlay for focused interactions |
| Drawer | `<uwc-drawer>` | Slide-in side panel |
| Form | `<uwc-form>` | Form container with validation |
| Context Menu | `<uwc-context-menu>` | Right-click menu |

---

## uwc-card

Elevated content container for grouping related information.

### Key Features
- Elevation (shadow) levels (0-5)
- Optional header, content, and action areas
- Media support (images, videos)
- Clickable card variants
- Two density modes (Standard: normal padding, Compact: reduced padding)

### Density Modes
- **Standard** (desktop): 24px padding
- **Compact** (mobile): 16px padding

### When to Use
- Group related content
- Dashboard widgets
- Product cards
- Profile cards
- Info panels

### Example
```html
<!-- Basic card -->
<uwc-card>
  <h3 slot="header">Card Title</h3>
  <p slot="content">This is the card content area.</p>
  <uwc-button slot="actions">Action</uwc-button>
</uwc-card>

<!-- Card with image -->
<uwc-card>
  <img slot="media" src="product.jpg" alt="Product">
  <h3 slot="header">Product Name</h3>
  <p slot="content">Product description here.</p>
  <uwc-button slot="actions">Buy Now</uwc-button>
</uwc-card>

<!-- Elevated card -->
<uwc-card elevation="3">
  <h3 slot="header">Important Notice</h3>
  <p slot="content">Highlighted content with elevation.</p>
</uwc-card>

<!-- Clickable card -->
<uwc-card clickable href="/details">
  <h3 slot="header">Click me</h3>
  <p slot="content">This entire card is clickable.</p>
</uwc-card>

<!-- Compact density -->
<uwc-card density="compact">
  <h3 slot="header">Compact Card</h3>
  <p slot="content">Reduced padding for dense layouts.</p>
</uwc-card>
```

### Best Practices
- Keep cards focused on single topic
- Use consistent elevation within app
- Don't nest cards deeply
- Use appropriate image aspect ratios
- Limit actions to 1-3 buttons
- Make entire card clickable OR provide distinct buttons (not both)

### Accessibility
- Provide meaningful headings
- Ensure sufficient contrast
- Use semantic HTML in slots
- Make clickable cards keyboard accessible
- Clear focus indicators

### Related Components
- [Expandable Card](#uwc-expandable-card) - Card with expand/collapse
- [Grid](data-display.md#uwc-grid) - Card layout

---

## uwc-expandable-card

Card with built-in expand/collapse functionality.

### Key Features
- Collapsible content area
- Expanded/collapsed states
- Header always visible
- Optional icon rotation on expand
- Smooth animation
- Two density modes

### Density Modes
- **Standard** (desktop): 24px padding
- **Compact** (mobile): 16px padding

### When to Use
- Optional detailed information
- FAQ sections
- Configuration panels
- Progressive disclosure
- Space-constrained layouts

### Example
```html
<!-- Basic expandable card -->
<uwc-expandable-card>
  <h3 slot="header">Account Summary</h3>
  <p slot="summary">Balance: $1,234.56</p>
  <div slot="content">
    <p>Detailed transaction history...</p>
    <uwc-flex-table data="..."></uwc-flex-table>
  </div>
</uwc-expandable-card>

<!-- Initially expanded -->
<uwc-expandable-card expanded>
  <h3 slot="header">Recent Activity</h3>
  <div slot="content">Activity details...</div>
</uwc-expandable-card>

<!-- With custom expand icon -->
<uwc-expandable-card expandIcon="add" collapseIcon="remove">
  <h3 slot="header">Advanced Options</h3>
  <div slot="content">Configuration options...</div>
</uwc-expandable-card>

<!-- Compact density -->
<uwc-expandable-card density="compact">
  <h3 slot="header">Compact Expandable</h3>
  <div slot="content">Content here...</div>
</uwc-expandable-card>
```

### Best Practices
- Keep summary visible when collapsed
- Use for optional/advanced information
- Don't nest expandable cards
- Provide visual expand/collapse indicator
- Consider default state based on importance

### Accessibility
- Use semantic headings
- Provide `aria-expanded` state
- Support keyboard (Enter/Space to toggle)
- Announce state changes to screen readers
- Maintain focus on toggle

### Related Components
- [Card](#uwc-card) - Non-expandable card
- [Expansion Panel](#uwc-expansion-panel) - Accordion panels

---

## uwc-expansion-panel

Accordion-style panel that expands/collapses, typically in a group.

### Key Features
- Part of expansion panel group
- Single or multiple expansion
- Header and content areas
- Disabled state
- Two density modes (Standard: 64px header, Compact: 48px header)

### Density Modes
- **Standard** (desktop): 64px header height
- **Compact** (mobile): 48px header height

### When to Use
- FAQ sections
- Settings groups
- Step-by-step instructions
- Grouped content
- Long-form content organization

### Example
```html
<!-- Expansion panel group -->
<uwc-expansion-panel-group>
  <uwc-expansion-panel>
    <h3 slot="header">What is UUX?</h3>
    <div slot="content">
      <p>UUX is the Temenos Unified User Experience design system...</p>
    </div>
  </uwc-expansion-panel>

  <uwc-expansion-panel>
    <h3 slot="header">How do I get started?</h3>
    <div slot="content">
      <p>Install via npm or CDN...</p>
    </div>
  </uwc-expansion-panel>

  <uwc-expansion-panel>
    <h3 slot="header">Is it accessible?</h3>
    <div slot="content">
      <p>Yes, all components comply with WCAG 2.2 AA...</p>
    </div>
  </uwc-expansion-panel>
</uwc-expansion-panel-group>

<!-- Allow multiple open -->
<uwc-expansion-panel-group multiple>
  <!-- Panels -->
</uwc-expansion-panel-group>

<!-- With disabled panel -->
<uwc-expansion-panel-group>
  <uwc-expansion-panel>
    <h3 slot="header">Available Panel</h3>
    <div slot="content">Content...</div>
  </uwc-expansion-panel>

  <uwc-expansion-panel disabled>
    <h3 slot="header">Disabled Panel</h3>
    <div slot="content">Not accessible...</div>
  </uwc-expansion-panel>
</uwc-expansion-panel-group>

<!-- Compact density -->
<uwc-expansion-panel-group density="compact">
  <!-- Panels -->
</uwc-expansion-panel-group>
```

### Best Practices
- Use for related content groups
- Single expansion mode for mutually exclusive content
- Multiple expansion mode for independent sections
- Keep headers concise and descriptive
- Consider first panel expanded by default

### Accessibility
- Use semantic heading levels
- Provide `aria-controls` and `aria-expanded`
- Support keyboard navigation (Tab, Enter, Arrow keys)
- Announce expansion state
- Maintain logical focus order

### Related Components
- [Expandable Card](#uwc-expandable-card) - Standalone expandable

---

## uwc-dialog

Modal overlay that focuses user attention on specific content or actions.

### Key Features
- Modal and non-modal modes
- Backdrop/overlay
- Header, content, and action areas
- Close button
- Scrollable content
- Size variants (small, medium, large, fullscreen)
- ESC key to close
- Focus trap

### When to Use
- Confirm destructive actions
- Capture focused input
- Display important information
- Multi-step workflows
- Form submissions

### Example
```html
<!-- IMPORTANT: See official UUX docs for complete API reference -->
<!-- docs/uux-docs/components/dialog/code.mdx -->

<!-- Basic confirmation dialog -->
<uwc-dialog id="confirmDialog" heading="Confirm Action">
  <p>Are you sure you want to delete this item?</p>
  <uwc-button label="Cancel" dialogAction="cancel" slot="secondaryAction"></uwc-button>
  <uwc-button label="Delete" dialogAction="delete" slot="primaryAction"></uwc-button>
</uwc-dialog>

<!-- Open dialog programmatically using .show() method -->
<uwc-button label="Open Dialog" @click=${() => this.showDialog()}></uwc-button>

<script>
  // CORRECT: Use .show() method, not .open()
  function showDialog() {
    const dialog = document.getElementById('confirmDialog');
    dialog.show();
  }
</script>

<!-- Form dialog -->
<uwc-dialog id="formDialog" heading="User Profile">
  <uwc-text-field label="Name" required></uwc-text-field>
  <uwc-text-field label="Email" type="email" required></uwc-text-field>
  <uwc-button label="Cancel" dialogAction="cancel" slot="secondaryAction"></uwc-button>
  <uwc-button label="Save" dialogAction="save" slot="primaryAction"></uwc-button>
</uwc-dialog>

<!-- Dialog with custom content -->
<uwc-dialog id="pickerDialog" heading="Select Date">
  <uwc-date-calendar></uwc-date-calendar>
  <uwc-button label="Cancel" dialogAction="cancel" slot="secondaryAction"></uwc-button>
  <uwc-button label="Set" dialogAction="set" slot="primaryAction"></uwc-button>
</uwc-dialog>

<!-- Alert dialog (single action) -->
<uwc-dialog id="alertDialog" heading="Success">
  <p>Your changes have been saved successfully.</p>
  <uwc-button label="OK" dialogAction="close" slot="primaryAction"></uwc-button>
</uwc-dialog>
```

**CRITICAL API Notes:**
- Use `heading` attribute for title (NOT `slot="header"`)
- Use `.show()` method to open (NOT `.open()`)
- Place content directly inside dialog (NO `slot="content"`)
- Use `slot="primaryAction"` and `slot="secondaryAction"` for buttons
- Use `dialogAction` attribute on buttons for built-in close behavior

**Correct vs Incorrect:**
```html
<!-- ✓ CORRECT -->
<uwc-dialog id="myDialog" heading="Title">
  <p>Content goes here</p>
  <uwc-button label="OK" slot="primaryAction"></uwc-button>
</uwc-dialog>
<script>document.getElementById('myDialog').show();</script>

<!-- ✗ WRONG - Don't use these patterns -->
<uwc-dialog id="myDialog">
  <h2 slot="header">Title</h2>
  <div slot="content">Content</div>
  <div slot="actions"><button>OK</button></div>
</uwc-dialog>
<script>document.getElementById('myDialog').open();</script>
```

### Dialog Sizes
- **Small**: 400px width - Quick confirmations, alerts
- **Medium**: 600px width - Standard forms, content
- **Large**: 800px width - Complex forms, detailed content
- **Fullscreen**: 100% viewport - Immersive experiences

### Best Practices
- Use sparingly (don't interrupt flow unnecessarily)
- Clear primary action
- Provide cancel/close option
- Keep content focused
- Avoid nested dialogs
- Use appropriate size for content
- Descriptive header text

### Accessibility
- Trap focus within dialog
- Restore focus on close
- Support ESC key to close
- Provide `role="dialog"` or `role="alertdialog"`
- Use `aria-labelledby` for header
- Ensure keyboard navigation
- Announce dialog opening

### Related Components
- [Drawer](#uwc-drawer) - Side panel alternative
- Confirmation Dialog (pattern with uwc-dialog)

---

## uwc-drawer

Slide-in panel from screen edge, typically for navigation or secondary content.

### Key Features
- Position (left, right, top, bottom)
- Modal and non-modal modes
- Backdrop/overlay
- Persistent or temporary
- Swipe to dismiss (mobile)
- Size configuration
- Two density modes

### Density Modes
- **Standard** (desktop): 320px width (side), normal padding
- **Compact** (mobile): 280px width (side), reduced padding

### When to Use
- Mobile navigation
- Filters and options
- Secondary content
- Context-specific actions
- App settings

### Example
```html
<!-- Left drawer (navigation) -->
<uwc-drawer position="left" id="navDrawer">
  <h3 slot="header">Navigation</h3>
  <uwc-list slot="content">
    <uwc-list-item icon="home">Home</uwc-list-item>
    <uwc-list-item icon="dashboard">Dashboard</uwc-list-item>
    <uwc-list-item icon="settings">Settings</uwc-list-item>
  </uwc-list>
</uwc-drawer>

<!-- Open drawer button -->
<uwc-icon-button icon="menu" onclick="navDrawer.open()">
</uwc-icon-button>

<!-- Right drawer (filters) -->
<uwc-drawer position="right">
  <h3 slot="header">Filters</h3>
  <uwc-form slot="content">
    <uwc-checkbox-group label="Categories">
      <uwc-checkbox label="Electronics"></uwc-checkbox>
      <uwc-checkbox label="Clothing"></uwc-checkbox>
    </uwc-checkbox-group>
    <uwc-date-range-picker label="Date Range"></uwc-date-range-picker>
  </uwc-form>
  <div slot="actions">
    <uwc-button>Apply Filters</uwc-button>
  </div>
</uwc-drawer>

<!-- Persistent drawer (desktop) -->
<uwc-drawer position="left" persistent modal="false">
  <uwc-navigation-rail></uwc-navigation-rail>
</uwc-drawer>

<!-- Custom width -->
<uwc-drawer position="right" width="400px">
  <h3 slot="header">Details</h3>
  <div slot="content">Detailed information...</div>
</uwc-drawer>
```

### Drawer Types
- **Temporary**: Overlays content, modal, dismisses on action
- **Persistent**: Pushes content, stays open, non-modal
- **Permanent**: Always visible (use Navigation Rail instead)

### Best Practices
- Left for navigation (in LTR layouts)
- Right for filters, details, actions
- Use persistent drawers on desktop
- Temporary drawers on mobile
- Provide close button
- Support swipe gestures on mobile

### Accessibility
- Trap focus in modal drawers
- Support ESC key to close
- Restore focus on close
- Provide `role="navigation"` or `role="complementary"`
- Support keyboard navigation
- Clear open/close indicators

### Related Components
- [Navigation Rail](navigation.md#uwc-navigation-rail) - Persistent navigation
- [Dialog](#uwc-dialog) - Modal alternative

---

## uwc-form

Form container with built-in validation and submission handling.

### Key Features
- Automatic validation
- Error aggregation
- Submit/reset handlers
- Field grouping
- Two density modes (Standard: 56px fields, Compact: 40px fields)

### Density Modes
- **Standard** (desktop): 56px input height
- **Compact** (mobile): 40px input height

### When to Use
- Any form with multiple fields
- Forms requiring validation
- Data submission
- User input collection

### Example
```html
<!-- Basic form -->
<uwc-form onsubmit="handleSubmit(event)">
  <uwc-text-field
    label="Name"
    name="name"
    required
    validationMessage="Please enter your name">
  </uwc-text-field>

  <uwc-text-field
    label="Email"
    name="email"
    type="email"
    required
    validationMessage="Please enter a valid email">
  </uwc-text-field>

  <uwc-text-area
    label="Message"
    name="message"
    required
    minlength="10">
  </uwc-text-area>

  <div slot="actions">
    <uwc-button type="reset" variant="text">Clear</uwc-button>
    <uwc-button type="submit" variant="filled">Submit</uwc-button>
  </div>
</uwc-form>

<!-- With error summary -->
<uwc-form>
  <uwc-error-summary id="formErrors"></uwc-error-summary>

  <!-- Form fields -->

  <uwc-button type="submit">Submit</uwc-button>
</uwc-form>

<!-- Compact density -->
<uwc-form density="compact">
  <!-- Form fields -->
</uwc-form>
```

### Best Practices
- Group related fields
- Show required field indicators
- Provide clear labels
- Use error summary for multiple errors
- Disable submit during submission
- Show success confirmation
- Preserve data on error

### Accessibility
- Use semantic `<form>` element
- Associate labels with inputs
- Provide clear error messages
- Support keyboard navigation
- Announce validation errors
- Clear focus management

### Related Components
- [Error Summary](feedback-status.md#uwc-error-summary) - Form error aggregation
- All [Form Inputs](form-inputs.md) - Form field components

---

## uwc-context-menu

Right-click context menu for contextual actions.

### Key Features
- Right-click trigger
- Custom trigger elements
- Menu positioning
- Nested submenus
- Dividers
- Disabled items
- Icons

### When to Use
- Contextual actions on items
- Table row actions
- File/folder actions
- Right-click shortcuts
- Context-sensitive operations

### Example
```html
<!-- Context menu on element -->
<div id="myElement" oncontextmenu="showContextMenu(event)">
  Right-click me
</div>

<uwc-context-menu id="contextMenu">
  <uwc-menu-item icon="edit">Edit</uwc-menu-item>
  <uwc-menu-item icon="copy">Copy</uwc-menu-item>
  <uwc-menu-item icon="paste">Paste</uwc-menu-item>
  <uwc-menu-divider></uwc-menu-divider>
  <uwc-menu-item icon="delete">Delete</uwc-menu-item>
</uwc-context-menu>

<!-- Table row context menu -->
<uwc-flex-table
  data="..."
  contextMenu="rowContextMenu">
</uwc-flex-table>

<uwc-context-menu id="rowContextMenu">
  <uwc-menu-item icon="visibility">View Details</uwc-menu-item>
  <uwc-menu-item icon="edit">Edit</uwc-menu-item>
  <uwc-menu-item icon="delete">Delete</uwc-menu-item>
</uwc-context-menu>

<!-- With submenu -->
<uwc-context-menu>
  <uwc-menu-item icon="save">Save</uwc-menu-item>
  <uwc-menu-item>
    Export
    <uwc-menu slot="submenu">
      <uwc-menu-item>Export as PDF</uwc-menu-item>
      <uwc-menu-item>Export as Excel</uwc-menu-item>
    </uwc-menu>
  </uwc-menu-item>
</uwc-context-menu>
```

### Best Practices
- Provide most common actions
- Duplicate functionality elsewhere (not everyone uses right-click)
- Use icons for clarity
- Group related actions with dividers
- Order by frequency of use
- Destructive actions at bottom

### Accessibility
- Support keyboard trigger (context menu key, Shift+F10)
- Provide alternative access method (menu button, actions column)
- Support keyboard navigation
- Announce menu opening
- Clear focus management

### Related Components
- [Menu Button](navigation.md#uwc-menu-button) - Click-triggered menu

---

## Best Practices

### Container Selection
- **Card**: Standalone content grouping
- **Expandable Card**: Optional details, FAQ
- **Expansion Panel**: Multiple related sections (accordion)
- **Dialog**: Focused, modal interactions
- **Drawer**: Slide-in navigation/filters
- **Form**: Structured data input
- **Context Menu**: Right-click actions

### Layout Hierarchy
1. Page structure (main, aside, nav)
2. Containers (cards, panels)
3. Content components
4. Form fields

### Modal Dialogs
- Use sparingly
- Clear purpose
- Easy to dismiss
- Focused content
- Accessible keyboard navigation

### Responsive Design
- Cards stack on mobile
- Drawers replace sidebars on mobile
- Dialogs adapt to screen size
- Use appropriate density modes
