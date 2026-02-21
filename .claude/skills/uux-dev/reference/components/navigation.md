# Navigation Components

Navigation components help users move through application screens and understand their current location within the application hierarchy.

## Components Overview

| Component | Tag | Primary Use |
|-----------|-----|-------------|
| Navigation Rail | `<uwc-navigation-rail>` | Vertical sidebar primary navigation |
| Breadcrumbs | `<uwc-breadcrumbs>` | Hierarchical location indicator |
| Tab Bar | `<uwc-tab-bar>` | Horizontal content area tabs |
| Menu Button | `<uwc-menu-button>` | Button with dropdown menu |

---

## uwc-navigation-rail

Vertical sidebar navigation with logo and icon buttons for primary application destinations.

### Key Features
- Sticky left-hand sidebar
- Logo placement at top
- Icon buttons with optional labels
- Active state indication
- Optional bottom menu for user/app actions
- 24px icons
- Compact design optimized for large screens

### When to Use
- Primary navigation for desktop applications
- High-priority destinations within easy reach
- Complex applications with multiple main sections
- When screen real estate allows persistent navigation

### Example

**IMPORTANT:** `uwc-navigation-rail` uses a `.menuItems` property (NOT child elements). You must set it programmatically.

```html
<!-- Empty navigation rail element -->
<uwc-navigation-rail></uwc-navigation-rail>
```

```typescript
// In your component's connectedCallback or firstUpdated:
const navRail = document.querySelector('uwc-navigation-rail') as any;

// Basic navigation with menuItems property
navRail.menuItems = [
  {
    icon: "home",
    label: "Home",
    labelDisplayType: "text", // Show label as text (vs tooltip)
    selected: true, // Active/selected state
    onClick: () => {
      // Handle navigation
      console.log('Home clicked');
    }
  },
  {
    icon: "dashboard",
    label: "Dashboard",
    labelDisplayType: "text",
    onClick: () => {
      console.log('Dashboard clicked');
    }
  },
  {
    icon: "analytics",
    label: "Analytics",
    labelDisplayType: "text",
    onClick: () => {
      console.log('Analytics clicked');
    }
  }
];

// With sub-menu (dropdown menu on click)
navRail.menuItems = [
  {
    icon: "home",
    label: "Home",
    onClick: () => { /* ... */ }
  },
  {
    icon: "account_circle",
    label: "User Menu",
    menuItems: [
      {
        label: "Profile Settings",
        action: () => {
          console.log('Profile clicked');
          return false; // Close menu after action
        }
      },
      { divider: true }, // Menu divider
      {
        label: "Logout",
        action: () => {
          console.log('Logout clicked');
          return false;
        }
      }
    ]
  }
];
```

**Lit Component Example:**
```typescript
// In your Lit component
private setupNavigationRail() {
  const navRail = this.shadowRoot?.querySelector('uwc-navigation-rail') as any;

  navRail.menuItems = [
    {
      icon: "dashboard",
      label: "Dashboard",
      selected: this.currentPage === 'dashboard',
      onClick: () => this.navigateTo('dashboard')
    },
    // ... more menu items
  ];
}
```

### Event Handling ⚡ CRITICAL

⚠️ **IMPORTANT**: UWC navigation-rail uses a **programmatic `.menuItems` property pattern** for event handling, not declarative `@click` handlers on child elements. This is because navigation items are rendered inside shadow DOM which blocks event bubbling.

#### ✅ **Correct Pattern** (Programmatic Setup)

```javascript
// Plain JavaScript
const navRail = document.querySelector('uwc-navigation-rail');

navRail.menuItems = [
  {
    icon: "dashboard",
    label: "Dashboard",
    labelDisplayType: "text",
    onClick: () => {
      console.log('Dashboard clicked!');
      navigateTo('/dashboard');
    }
  },
  {
    icon: "account_balance",
    label: "Accounts",
    labelDisplayType: "text",
    onClick: () => navigateTo('/accounts')
  },
  {
    icon: "swap_horiz",
    label: "Transfer",
    labelDisplayType: "text",
    onClick: () => navigateTo('/transfer')
  }
];
```

#### With Lit Elements (Recommended for Complex Apps)

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-app-shell')
export class AppShell extends LitElement {
  override connectedCallback() {
    super.connectedCallback();

    this.updateComplete.then(() => {
      this.setupNavigation();
    });
  }

  private setupNavigation() {
    const navRail = this.shadowRoot?.querySelector('uwc-navigation-rail');
    if (!navRail) return;

    navRail.menuItems = [
      {
        icon: "dashboard",
        label: "Dashboard",
        labelDisplayType: "text",
        onClick: () => this.handleNavigation('dashboard')
      },
      {
        icon: "accounts",
        label: "Accounts",
        labelDisplayType: "text",
        onClick: () => this.handleNavigation('accounts')
      }
    ];
  }

  private handleNavigation(page: string) {
    // Your routing logic here
    Router.go(`/${page}`);
  }

  render() {
    return html`<uwc-navigation-rail></uwc-navigation-rail>`;
  }
}
```

#### With Sub-Menus (Bottom Menu Pattern)

```javascript
navRail.menuItems = [
  // Main navigation items
  { icon: "home", label: "Home", labelDisplayType: "text", onClick: () => navigateTo('/') },
  { icon: "dashboard", label: "Dashboard", labelDisplayType: "text", onClick: () => navigateTo('/dashboard') },

  // Bottom menu with sub-items (user menu)
  {
    icon: "account_circle",
    menuItems: [
      { label: "John Doe", action: () => false }, // Info item (no action)
      { divider: true },
      { label: "Settings", action: () => navigateTo('/settings') },
      { label: "Help & Support", action: () => showHelp() },
      { divider: true },
      { label: "Logout", action: () => handleLogout() }
    ]
  }
];
```

**Note**: Sub-menu items use `action` instead of `onClick`.

#### ❌ **Common Mistake** (Won't Work Due to Shadow DOM)

```html
<!-- ❌ This pattern looks correct but onClick won't fire -->
<uwc-navigation-rail>
  <uwc-navigation-rail-item
    icon="dashboard"
    label="Dashboard"
    @click=${() => navigateTo('/dashboard')}>  <!-- ❌ Event blocked by shadow DOM -->
  </uwc-navigation-rail-item>
</uwc-navigation-rail>
```

**Why this doesn't work:**
- UWC components use closed shadow DOM
- Click events inside shadow DOM don't bubble to the host element
- The `@click` handler on `<uwc-navigation-rail-item>` never receives events
- Must use `.menuItems` property with `onClick` callbacks instead

#### Reference

Based on official UWC documentation:
- Source: `docs/uux-docs/components/navigation-rail/code.mdx`
- [Temenos UUX Navigation Rail](https://developer.temenos.com/uux/docs/components/navigation-rail/code)

### States
- **Active**: Currently selected destination (filled background)
- **Hover**: Visual feedback on hover (colored ring)
- **Focused**: Keyboard focus indicator

### Best Practices
- Use for 3-7 primary destinations
- Place most important items at top
- Use recognizable, consistent icons
- Ensure active state is clearly visible
- Set `labelDisplayType="text"` for better accessibility
- Reserve bottom menu for user/app actions (profile, logout, refresh)

### Accessibility
- Always provide `label` attributes for screen readers
- Use semantic HTML for navigation structure
- Support keyboard navigation (Tab, Arrow keys, Enter/Space)
- Consider showing text labels persistently with `labelDisplayType="text"`

### CSS Custom Properties

UWC navigation-rail exposes CSS custom properties for customization:

#### Width & Layout
- `--uwc-navigation-rail-width: 62px` - Navigation rail width (default: 62px for icon-only)
  - Recommended: 200-280px when using `labelDisplayType="text"` for full label visibility
  - Example: `--uwc-navigation-rail-width: 280px;`
- `--uwc-navigation-rail-min-height: 100%` - Minimum height of navigation rail
- `--uwc-navigation-rail-padding: 5px 0` - Internal padding
- `--uwc-navigation-rail-margin` - External margin (optional)
- `--uwc-navigation-rail-position: fixed` - CSS position property
- `--uwc-navigation-rail-z-index: 7` - Stacking order

#### Colors & Theming
- `--uwc-navigation-rail-background-color: var(--uwc-temenos-lightest)` - Background color
- `--uwc-navigation-rail-button-color-focus: var(--uwc-temenos-light)` - Focused button color
- `--uwc-navigation-rail-button-color-hover: transparent` - Hover button background
- `--uwc-navigation-rail-button-border-color-hover: var(--uwc-temenos-light)` - Hover border color
- `--uwc-navigation-rail-button-border-color-focus: var(--uwc-temenos-light)` - Focus border color
- `--uwc-navigation-rail-button-ripple-color: #538bff` - Ripple effect color

#### Typography & Items
- `--uwc-navigation-rail-font-size: 0.875rem` - Font size for labels
- `--uwc-navigation-rail-item-height: 40px` - Menu item height
- `--uwc-navigation-rail-item-padding: 15px 0 0 0` - Individual item padding
- `--uwc-navigation-rail-button-height: 40px` - Button height
- `--uwc-navigation-rail-button-border-radius: 0` - Button corner radius
- `--uwc-navigation-rail-button-font-weight: 400` - Button text weight
- `--uwc-navigation-text-align: center` - Text alignment

#### Usage Examples

**In Component CSS:**
```css
uwc-navigation-rail {
  --uwc-navigation-rail-width: 280px;
  --uwc-navigation-rail-background-color: #2C3361;
}
```

**In Global Styles:**
```css
:root {
  --uwc-navigation-rail-width: 280px;
}
```

**Inline (Lit/TypeScript):**
```typescript
const navRail = this.shadowRoot?.querySelector('uwc-navigation-rail');
navRail.style.setProperty('--uwc-navigation-rail-width', '280px');
```

**Important Notes:**
- When using `labelDisplayType="text"`, always increase `--uwc-navigation-rail-width` to 200-280px
- Default 62px width is optimized for icon-only mode (tooltip labels)
- Adjust container width alongside custom property for proper layout

### Related Components
- [Tab Bar](#uwc-tab-bar) - Horizontal tab navigation
- [Menu Button](#uwc-menu-button) - Dropdown menu actions
- [Icon Button](buttons-actions.md#uwc-icon-button) - Icon-only buttons
- [Breadcrumbs](#uwc-breadcrumbs) - Hierarchical navigation

---

## uwc-breadcrumbs

Hierarchical location indicator showing the user's path from root to current page.

### Key Features
- Hierarchical path display
- Clickable ancestors
- Current page (non-clickable)
- Separator customization
- Overflow handling for long paths
- Two density modes (Standard: 40px height, Compact: 32px height)

### Density Modes
- **Standard** (desktop): 40px height
- **Compact** (mobile): 32px height

### When to Use
- Deep navigation hierarchies (3+ levels)
- E-commerce category navigation
- File/folder navigation
- Multi-level application structures
- Help users understand current location

### Example
```html
<!-- Basic breadcrumbs -->
<uwc-breadcrumbs>
  <uwc-breadcrumb-item href="/">Home</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/products">Products</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/products/electronics">Electronics</uwc-breadcrumb-item>
  <uwc-breadcrumb-item>Laptops</uwc-breadcrumb-item>
</uwc-breadcrumbs>

<!-- With custom separator -->
<uwc-breadcrumbs separator=">">
  <uwc-breadcrumb-item href="/">Home</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/accounts">Accounts</uwc-breadcrumb-item>
  <uwc-breadcrumb-item>Account Details</uwc-breadcrumb-item>
</uwc-breadcrumbs>

<!-- With icons -->
<uwc-breadcrumbs>
  <uwc-breadcrumb-item href="/" icon="home">Home</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/dashboard" icon="dashboard">Dashboard</uwc-breadcrumb-item>
  <uwc-breadcrumb-item icon="person">User Profile</uwc-breadcrumb-item>
</uwc-breadcrumbs>

<!-- Compact density -->
<uwc-breadcrumbs density="compact">
  <uwc-breadcrumb-item href="/">Home</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/reports">Reports</uwc-breadcrumb-item>
  <uwc-breadcrumb-item>Q1 2025</uwc-breadcrumb-item>
</uwc-breadcrumbs>

<!-- With overflow (long paths) -->
<uwc-breadcrumbs maxItems="4">
  <uwc-breadcrumb-item href="/">Home</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/level1">Level 1</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/level1/level2">Level 2</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/level1/level2/level3">Level 3</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/level1/level2/level3/level4">Level 4</uwc-breadcrumb-item>
  <uwc-breadcrumb-item>Current Page</uwc-breadcrumb-item>
</uwc-breadcrumbs>
<!-- Displays: Home > ... > Level 3 > Level 4 > Current Page -->
```

### Best Practices
- Keep breadcrumb labels concise (1-3 words)
- Always make ancestors clickable (except current page)
- Use consistent separators (default: /)
- Don't duplicate page title
- Place at top of content area, below header
- Limit to 7-8 levels maximum (use overflow for longer paths)

### Accessibility
- Use semantic `<nav>` element
- Provide `aria-label="Breadcrumb"` for screen readers
- Current page should have `aria-current="page"`
- Ensure sufficient color contrast for links

### Related Components
- [Navigation Rail](#uwc-navigation-rail) - Primary navigation
- [Tab Bar](#uwc-tab-bar) - Content area navigation

---

## uwc-tab-bar

Horizontal tabs for switching between related content views within the same context.

### Key Features
- Horizontal tab layout
- Active tab indicator (underline)
- Icon + text or text-only tabs
- Scrollable for many tabs
- Two density modes (Standard: 48px height, Compact: 40px height)

### Density Modes
- **Standard** (desktop): 48px tab height
- **Compact** (mobile): 40px tab height

### When to Use
- Switch between related views (e.g., "Overview", "Details", "History")
- Content organization within a page
- Settings/configuration sections
- Dashboard views

### Example
```html
<!-- Basic tab bar -->
<uwc-tab-bar activeIndex="0">
  <uwc-tab label="Overview"></uwc-tab>
  <uwc-tab label="Details"></uwc-tab>
  <uwc-tab label="History"></uwc-tab>
  <uwc-tab label="Settings"></uwc-tab>
</uwc-tab-bar>

<!-- With icons -->
<uwc-tab-bar>
  <uwc-tab icon="dashboard" label="Dashboard"></uwc-tab>
  <uwc-tab icon="table" label="Data"></uwc-tab>
  <uwc-tab icon="chart" label="Charts"></uwc-tab>
  <uwc-tab icon="settings" label="Settings"></uwc-tab>
</uwc-tab-bar>

<!-- Icon-only tabs (not recommended for accessibility) -->
<uwc-tab-bar>
  <uwc-tab icon="home" ariaLabel="Home"></uwc-tab>
  <uwc-tab icon="inbox" ariaLabel="Inbox"></uwc-tab>
  <uwc-tab icon="notifications" ariaLabel="Notifications"></uwc-tab>
</uwc-tab-bar>

<!-- Compact density -->
<uwc-tab-bar density="compact">
  <uwc-tab label="Active"></uwc-tab>
  <uwc-tab label="Pending"></uwc-tab>
  <uwc-tab label="Completed"></uwc-tab>
</uwc-tab-bar>

<!-- Scrollable (many tabs) -->
<uwc-tab-bar scrollable>
  <uwc-tab label="Tab 1"></uwc-tab>
  <uwc-tab label="Tab 2"></uwc-tab>
  <uwc-tab label="Tab 3"></uwc-tab>
  <uwc-tab label="Tab 4"></uwc-tab>
  <uwc-tab label="Tab 5"></uwc-tab>
  <uwc-tab label="Tab 6"></uwc-tab>
  <uwc-tab label="Tab 7"></uwc-tab>
  <uwc-tab label="Tab 8"></uwc-tab>
</uwc-tab-bar>
```

### Best Practices
- Use 2-7 tabs (consider dropdown menu for more)
- Keep tab labels short (1-2 words)
- Order tabs by importance or logical flow
- Avoid nesting tabs (use different navigation pattern)
- Always show labels (avoid icon-only for main navigation)
- Use for content switching, not navigation to different pages

### Accessibility
- Use semantic tab structure (`role="tablist"`, `role="tab"`, `role="tabpanel"`)
- Support keyboard navigation (Arrow keys, Home, End)
- Provide `aria-label` for icon-only tabs
- Ensure active tab has `aria-selected="true"`
- Maintain focus visibility

### Related Components
- [Navigation Rail](#uwc-navigation-rail) - Primary app navigation
- [Button Toggle](buttons-actions.md#uwc-button-toggle) - Toggle button group (2-4 options)

---

## uwc-menu-button

Button that opens a dropdown menu with actions or navigation options.

### Key Features
- Button with attached menu
- Icon or text button
- Menu positioning (auto, below, above)
- Nested submenus support
- Dividers and disabled items
- Two density modes (Standard: 40px button, Compact: 32px button)

### Density Modes
- **Standard** (desktop): 40px button height
- **Compact** (mobile): 32px button height

### When to Use
- Overflow actions menu (3+ actions)
- Context-sensitive actions
- User account menu
- Settings/preferences access
- Navigation options

### Example
```html
<!-- Basic menu button -->
<uwc-menu-button label="Actions">
  <uwc-menu-item>Edit</uwc-menu-item>
  <uwc-menu-item>Duplicate</uwc-menu-item>
  <uwc-menu-item>Delete</uwc-menu-item>
</uwc-menu-button>

<!-- Icon menu button -->
<uwc-menu-button icon="more_vert" ariaLabel="More actions">
  <uwc-menu-item icon="edit">Edit</uwc-menu-item>
  <uwc-menu-item icon="copy">Copy</uwc-menu-item>
  <uwc-menu-item icon="delete">Delete</uwc-menu-item>
</uwc-menu-button>

<!-- With dividers and disabled items -->
<uwc-menu-button label="File">
  <uwc-menu-item icon="save">Save</uwc-menu-item>
  <uwc-menu-item icon="save_as">Save As...</uwc-menu-item>
  <uwc-menu-divider></uwc-menu-divider>
  <uwc-menu-item icon="print">Print</uwc-menu-item>
  <uwc-menu-divider></uwc-menu-divider>
  <uwc-menu-item icon="close" disabled>Close</uwc-menu-item>
</uwc-menu-button>

<!-- User account menu -->
<uwc-menu-button icon="account_circle" ariaLabel="Account">
  <uwc-menu-item icon="person">Profile</uwc-menu-item>
  <uwc-menu-item icon="settings">Settings</uwc-menu-item>
  <uwc-menu-divider></uwc-menu-divider>
  <uwc-menu-item>Last refreshed: 2:30 PM</uwc-menu-item>
  <uwc-menu-divider></uwc-menu-divider>
  <uwc-menu-item icon="logout">Logout</uwc-menu-item>
</uwc-menu-button>

<!-- With nested submenu -->
<uwc-menu-button label="Export">
  <uwc-menu-item>
    Export as PDF
    <uwc-menu slot="submenu">
      <uwc-menu-item>Current Page</uwc-menu-item>
      <uwc-menu-item>All Pages</uwc-menu-item>
      <uwc-menu-item>Selected Pages</uwc-menu-item>
    </uwc-menu>
  </uwc-menu-item>
  <uwc-menu-item>Export as Excel</uwc-menu-item>
  <uwc-menu-item>Export as CSV</uwc-menu-item>
</uwc-menu-button>

<!-- Compact density -->
<uwc-menu-button label="Options" density="compact">
  <uwc-menu-item>Option 1</uwc-menu-item>
  <uwc-menu-item>Option 2</uwc-menu-item>
</uwc-menu-button>
```

### Best Practices
- Use for 3+ actions (2 actions = separate buttons)
- Group related actions with dividers
- Order actions by frequency of use
- Destructive actions (Delete) at bottom
- Provide icons for clarity
- Use consistent menu patterns across app
- Avoid deeply nested submenus (2 levels max)

### Accessibility
- Use `ariaLabel` for icon-only buttons
- Support keyboard navigation (Arrow keys, Enter, Escape)
- Ensure focus returns to button on close
- Mark destructive actions clearly
- Support screen reader announcements

### Related Components
- [Button](buttons-actions.md#uwc-button) - Standard action button
- [Icon Button](buttons-actions.md#uwc-icon-button) - Icon-only button
- [Context Menu](layout-containers.md#uwc-context-menu) - Right-click menu
- [Navigation Rail](#uwc-navigation-rail) - Uses menu button for bottom menu

---

## Navigation Patterns

### Primary Navigation (Desktop)
Use **Navigation Rail** for main application destinations:
```html
<uwc-navigation-rail>
  <uwc-navigation-rail-item icon="home" label="Home"></uwc-navigation-rail-item>
  <uwc-navigation-rail-item icon="dashboard" label="Dashboard"></uwc-navigation-rail-item>
  <uwc-navigation-rail-item icon="reports" label="Reports"></uwc-navigation-rail-item>
</uwc-navigation-rail>
```

### Secondary Navigation (Content Area)
Use **Tab Bar** for related content views:
```html
<uwc-tab-bar>
  <uwc-tab label="Overview"></uwc-tab>
  <uwc-tab label="Details"></uwc-tab>
  <uwc-tab label="History"></uwc-tab>
</uwc-tab-bar>
```

### Hierarchical Navigation
Use **Breadcrumbs** to show location depth:
```html
<uwc-breadcrumbs>
  <uwc-breadcrumb-item href="/">Home</uwc-breadcrumb-item>
  <uwc-breadcrumb-item href="/products">Products</uwc-breadcrumb-item>
  <uwc-breadcrumb-item>Details</uwc-breadcrumb-item>
</uwc-breadcrumbs>
```

### Action Menus
Use **Menu Button** for overflow actions:
```html
<uwc-menu-button icon="more_vert">
  <uwc-menu-item>Edit</uwc-menu-item>
  <uwc-menu-item>Share</uwc-menu-item>
  <uwc-menu-item>Delete</uwc-menu-item>
</uwc-menu-button>
```

## Best Practices

### Combining Navigation Components
- **Navigation Rail** (primary) + **Breadcrumbs** (location) + **Tab Bar** (content views)
- Don't use multiple navigation rails
- Don't nest tab bars
- Breadcrumbs should appear below main nav, above content

### Mobile Considerations
- Navigation Rail: Convert to drawer/hamburger menu on mobile
- Tab Bar: Enable scrolling or convert to dropdown on mobile
- Breadcrumbs: Show only last 2-3 levels on mobile
- Menu Button: Works well on all screen sizes

### Consistency
- Use same navigation patterns across application
- Maintain consistent ordering of navigation items
- Use consistent icon set
- Keep label terminology consistent

### Accessibility
- All navigation must be keyboard accessible
- Provide skip links for screen readers
- Use semantic HTML (`<nav>`, `role="navigation"`)
- Ensure sufficient color contrast
- Support focus indicators
