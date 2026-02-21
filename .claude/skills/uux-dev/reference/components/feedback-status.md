# Feedback & Status Components

Components for providing user feedback, displaying notifications, showing progress, and communicating system status.

## Components Overview

| Component | Tag | Primary Use |
|-----------|-----|-------------|
| Tooltip | `<uwc-tooltip>` | Contextual help text on hover |
| Notifications Panel | `<uwc-notifications-panel>` | Alert and notification center |
| Linear Progress | `<uwc-linear-progress>` | Progress indicator bar |
| Badge | `<uwc-badge>` | Status or count indicator |
| Error Summary | `<uwc-error-summary>` | Form error aggregation |
| Stepper | `<uwc-stepper>` | Multi-step process indicator |

---

## uwc-tooltip

Contextual help text that appears on hover or focus.

### Key Features
- Appears on hover/focus
- Configurable position (top, bottom, left, right, auto)
- Delay configuration
- Arrow pointer
- Dark and light themes
- Touch-friendly (tap to show on mobile)

### When to Use
- Explain icon buttons
- Provide additional context
- Show truncated text in full
- Help text for form fields
- Keyboard shortcuts

### Example
```html
<!-- Basic tooltip -->
<uwc-icon-button icon="help">
  <uwc-tooltip>Click to view help documentation</uwc-tooltip>
</uwc-icon-button>

<!-- Positioned tooltip -->
<uwc-button>
  Save
  <uwc-tooltip position="top">Save your changes (Ctrl+S)</uwc-tooltip>
</uwc-button>

<!-- With delay -->
<uwc-icon-button icon="info">
  <uwc-tooltip delay="500">Additional information about this feature</uwc-tooltip>
</uwc-icon-button>

<!-- Light theme tooltip -->
<uwc-button>
  Action
  <uwc-tooltip theme="light">This is a light themed tooltip</uwc-tooltip>
</uwc-button>
```

### Best Practices
- Keep text concise (1-2 sentences max)
- Don't repeat visible labels
- Use for supplementary info, not critical instructions
- Avoid for essential information (not always discoverable)
- Ensure readable contrast

### Accessibility
- Use `aria-describedby` to associate tooltip
- Ensure keyboard triggerable (focus)
- Don't hide critical info in tooltips
- Support ESC key to dismiss
- Consider persistent alternatives for touch devices

### Related Components
- [Badge](#uwc-badge) - Persistent status indicator
- Dialog (layout-containers.md) - For longer help content

---

## uwc-notifications-panel

Centralized notification and alert panel, typically accessed from header/toolbar.

### Key Features
- Notification list
- Badge count indicator
- Categorization (info, success, warning, error)
- Mark as read/unread
- Clear all notifications
- Timestamp display
- Action buttons per notification
- Two density modes (Standard: 72px notification height, Compact: 56px notification height)

### Density Modes
- **Standard** (desktop): 72px notification height
- **Compact** (mobile): 56px notification height

### When to Use
- System notifications
- User activity alerts
- Task completion messages
- Error/warning notifications
- Real-time updates

### Example
```html
<!-- Notification panel trigger -->
<uwc-icon-button icon="notifications">
  <uwc-badge count="3"></uwc-badge>
</uwc-icon-button>

<!-- Notifications panel -->
<uwc-notifications-panel
  notifications='[
    {
      "id": 1,
      "type": "info",
      "title": "System Update",
      "message": "New features available",
      "timestamp": "2025-10-17T10:30:00",
      "read": false
    },
    {
      "id": 2,
      "type": "success",
      "title": "Payment Received",
      "message": "Payment of $1,234.56 received",
      "timestamp": "2025-10-17T09:15:00",
      "read": false
    },
    {
      "id": 3,
      "type": "warning",
      "title": "Pending Approval",
      "message": "3 transactions require your approval",
      "timestamp": "2025-10-17T08:00:00",
      "read": true,
      "action": {"label": "Review", "url": "/approvals"}
    }
  ]'>
</uwc-notifications-panel>

<!-- With clear all -->
<uwc-notifications-panel
  notifications="..."
  showClearAll>
</uwc-notifications-panel>

<!-- Compact density -->
<uwc-notifications-panel
  notifications="..."
  density="compact">
</uwc-notifications-panel>
```

### Notification Types
- **Info** (blue): General information, updates
- **Success** (green): Completed actions, confirmations
- **Warning** (amber): Attention needed, non-critical issues
- **Error** (red): Failures, critical issues

### Best Practices
- Show most recent notifications first
- Limit to 50-100 recent notifications
- Provide "Mark all as read" action
- Auto-dismiss transient notifications
- Group similar notifications
- Use appropriate severity levels
- Include actionable items when relevant

### Accessibility
- Announce new notifications to screen readers
- Support keyboard navigation
- Clear focus management
- Provide notification count in badge
- Use semantic colors + icons (not color alone)

### Related Components
- [Badge](#uwc-badge) - Notification count indicator
- Dialog (layout-containers.md) - Modal notifications

---

## uwc-linear-progress

Progress indicator showing completion percentage or indeterminate loading.

### Key Features
- Determinate (percentage) mode
- Indeterminate (loading) mode
- Configurable colors
- Label/percentage display
- Buffer progress (for streaming)
- Two density modes (Standard: 4px height, Compact: 2px height)

### Density Modes
- **Standard** (desktop): 4px height
- **Compact** (mobile): 2px height

### When to Use
- File upload progress
- Data loading
- Multi-step process progress
- Background task status
- Page load indicator

### Example
```html
<!-- Determinate progress (percentage) -->
<uwc-linear-progress
  value="65"
  label="Uploading file..."
  showPercentage>
</uwc-linear-progress>

<!-- Indeterminate progress (loading) -->
<uwc-linear-progress
  indeterminate
  label="Loading data...">
</uwc-linear-progress>

<!-- Buffer progress (streaming) -->
<uwc-linear-progress
  value="45"
  buffer="75"
  label="Streaming video...">
</uwc-linear-progress>

<!-- Compact density -->
<uwc-linear-progress
  value="80"
  density="compact">
</uwc-linear-progress>

<!-- Custom color -->
<uwc-linear-progress
  value="90"
  color="success">
</uwc-linear-progress>
```

### Best Practices
- Use determinate when progress is measurable
- Use indeterminate for unknown duration tasks
- Provide descriptive labels
- Show percentage for long operations
- Consider time estimate for user expectations
- Use at top of affected area

### Accessibility
- Use `role="progressbar"`
- Provide `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for determinate
- Provide `aria-label` for context
- Announce completion to screen readers

### Related Components
- [Stepper](#uwc-stepper) - Multi-step process indicator
- Circular Progress (if available) - Alternative progress indicator

---

## uwc-badge

Small status or count indicator, typically overlaid on icons or avatars.

### Key Features
- Numeric count display
- Dot indicator (no count)
- Position configuration (top-right, top-left, etc.)
- Max count (e.g., "99+")
- Status colors (info, success, warning, error, neutral)
- Two density modes (Standard: 20px, Compact: 16px)

### Density Modes
- **Standard** (desktop): 20px diameter
- **Compact** (mobile): 16px diameter

### When to Use
- Notification counts
- Unread message counts
- Cart item counts
- Status indicators
- New item indicators

### Example
```html
<!-- Notification badge -->
<uwc-icon-button icon="notifications">
  <uwc-badge count="5"></uwc-badge>
</uwc-icon-button>

<!-- Message badge -->
<uwc-icon-button icon="mail">
  <uwc-badge count="24" max="99"></uwc-badge>
</uwc-icon-button>

<!-- Dot indicator (no count) -->
<uwc-icon-button icon="inbox">
  <uwc-badge dot></uwc-badge>
</uwc-icon-button>

<!-- Status badge -->
<uwc-avatar src="...">
  <uwc-badge status="success" position="bottom-right"></uwc-badge>
</uwc-avatar>

<!-- Custom color -->
<uwc-icon-button icon="shopping_cart">
  <uwc-badge count="3" color="error"></uwc-badge>
</uwc-icon-button>

<!-- Compact density -->
<uwc-icon-button icon="notifications">
  <uwc-badge count="12" density="compact"></uwc-badge>
</uwc-icon-button>
```

### Badge Types
- **Count**: Shows numeric value (notifications, messages, cart items)
- **Dot**: Simple indicator (new item, online status)
- **Status**: Colored indicator (online, busy, away, offline)

### Best Practices
- Use max count (e.g., "99+") for very large numbers
- Use dot for simple "new" indicators
- Don't overuse badges (visual clutter)
- Ensure sufficient contrast with background
- Update count in real-time

### Accessibility
- Provide `aria-label` describing count/status
- Use semantic HTML for count value
- Don't rely on color alone for status
- Announce count changes to screen readers

### Related Components
- [Notifications Panel](#uwc-notifications-panel) - Detailed notifications
- Icon Button (buttons-actions.md) - Common badge container

---

## uwc-error-summary

Aggregates and displays all form validation errors in one place.

### Key Features
- Lists all form errors
- Links to error fields
- Error count display
- Auto-scroll to errors
- Real-time error updates
- Dismissible
- Two density modes

### Density Modes
- **Standard** (desktop): Normal padding
- **Compact** (mobile): Reduced padding

### When to Use
- Multi-field forms
- Complex validation
- Long forms (errors not all visible)
- Form submission failures
- Required for accessibility best practices

### Example
```html
<!-- Error summary at top of form -->
<uwc-error-summary
  errors='[
    {"field": "email", "message": "Please enter a valid email address"},
    {"field": "password", "message": "Password must be at least 8 characters"},
    {"field": "confirmPassword", "message": "Passwords do not match"}
  ]'>
</uwc-error-summary>

<uwc-form>
  <uwc-text-field
    id="email"
    label="Email"
    type="email"
    required
    validationMessage="Please enter a valid email address">
  </uwc-text-field>

  <uwc-text-field
    id="password"
    label="Password"
    type="password"
    required
    validationMessage="Password must be at least 8 characters">
  </uwc-text-field>

  <!-- More fields -->
</uwc-form>

<!-- With error count -->
<uwc-error-summary
  title="There are 3 errors in this form"
  errors="..."
  showCount>
</uwc-error-summary>
```

### Best Practices
- Place at top of form (above first field)
- Make errors clickable (link to field)
- Update in real-time as errors are fixed
- Auto-scroll to error summary on submission
- Use clear, actionable error messages
- Show error count in summary title

### Accessibility
- Use `role="alert"` for screen reader announcement
- Focus error summary on form submission
- Provide clear heading
- Link errors to specific fields
- Maintain logical tab order

### Related Components
- Form (layout-containers.md) - Form container with validation
- Text Field (form-inputs.md) - Individual field validation

---

## uwc-stepper

Visual indicator of multi-step process progress.

### Key Features
- Horizontal and vertical layouts
- Step completion status
- Current step indication
- Clickable steps (navigation)
- Optional step numbers
- Step labels and descriptions
- Error state per step
- Two density modes (Standard: 72px step height, Compact: 56px step height)

### Density Modes
- **Standard** (desktop): 72px step height (horizontal)
- **Compact** (mobile): 56px step height (horizontal)

### When to Use
- Multi-step forms
- Onboarding flows
- Checkout processes
- Wizard-style workflows
- Sequential task completion

### Example
```html
<!-- Basic horizontal stepper -->
<uwc-stepper activeStep="1">
  <uwc-step label="Account Information" completed></uwc-step>
  <uwc-step label="Personal Details" active></uwc-step>
  <uwc-step label="Payment Method"></uwc-step>
  <uwc-step label="Review & Submit"></uwc-step>
</uwc-stepper>

<!-- Vertical stepper -->
<uwc-stepper orientation="vertical" activeStep="0">
  <uwc-step label="Shipping Address">
    <p>Enter your shipping address</p>
  </uwc-step>
  <uwc-step label="Delivery Method">
    <p>Choose delivery speed</p>
  </uwc-step>
  <uwc-step label="Payment">
    <p>Enter payment details</p>
  </uwc-step>
</uwc-stepper>

<!-- With descriptions -->
<uwc-stepper activeStep="2">
  <uwc-step
    label="Create Account"
    description="Basic information"
    completed>
  </uwc-step>
  <uwc-step
    label="Verify Email"
    description="Check your inbox"
    completed>
  </uwc-step>
  <uwc-step
    label="Setup Profile"
    description="Add photo and bio"
    active>
  </uwc-step>
</uwc-stepper>

<!-- With error state -->
<uwc-stepper activeStep="1">
  <uwc-step label="Step 1" completed></uwc-step>
  <uwc-step label="Step 2" error>Please correct errors</uwc-step>
  <uwc-step label="Step 3"></uwc-step>
</uwc-stepper>

<!-- Compact density -->
<uwc-stepper activeStep="0" density="compact">
  <uwc-step label="Step 1"></uwc-step>
  <uwc-step label="Step 2"></uwc-step>
  <uwc-step label="Step 3"></uwc-step>
</uwc-stepper>
```

### Step States
- **Incomplete**: Not yet reached (gray)
- **Active**: Currently on this step (blue, emphasized)
- **Completed**: Successfully finished (green, checkmark)
- **Error**: Has validation errors (red, error icon)

### Best Practices
- Use 3-7 steps (2 is too few, 8+ is too many)
- Keep step labels short (1-3 words)
- Show progress clearly
- Allow navigation to completed steps
- Indicate optional steps
- Use vertical layout for mobile
- Show error states clearly

### Accessibility
- Use semantic HTML for step list
- Provide `aria-current="step"` for active step
- Support keyboard navigation
- Announce step changes to screen readers
- Clear focus indicators

### Related Components
- [Linear Progress](#uwc-linear-progress) - Progress bar alternative
- Form (layout-containers.md) - Multi-step form container

---

## Best Practices

### Feedback Timing
- **Immediate** (Tooltip): On hover/focus
- **Transient** (Toast/Snackbar): 3-5 seconds
- **Persistent** (Badge, Notifications): Until dismissed
- **Progressive** (Linear Progress): During operation

### Status Communication
- Use **colors** + **icons** (not color alone for accessibility)
- **Info** (blue, info icon): General updates
- **Success** (green, checkmark): Completed actions
- **Warning** (amber, warning icon): Attention needed
- **Error** (red, error icon): Failures

### User Experience
- Don't interrupt user flow unnecessarily
- Provide actionable feedback
- Clear paths to resolve issues
- Consistent feedback patterns across app
- Appropriate feedback urgency

### Accessibility
- Announce dynamic changes to screen readers
- Don't rely on color alone
- Ensure keyboard accessibility
- Provide text alternatives
- Support user preferences (reduced motion)
