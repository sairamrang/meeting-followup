# Tech Stack: Temenos UUX + Lit + TypeScript

**Product Type:** Web Application
**Category:** Banking/Financial Services UI
**Stack ID:** uux-lit-ts
**Version:** 1.0
**Last Updated:** 2025-01-11

---

## Stack Overview

This tech stack is for building web applications using:
- **Temenos UUX** (Unified UX) web components for consistent banking UI
- **Lit 3.x** for lightweight web components
- **TypeScript** for type-safe development
- **Vite** for fast development and optimized builds

**Use when:**
- Building Temenos banking products
- Need design system consistency across products
- Building component-based single-page applications
- Targeting modern browsers with web component support

---

## Technology Stack

### Frontend Framework
- **Lit 3.x** - Lightweight web component library
- **Temenos UUX (@unified-ux/uux-web)** - Banking-specific component library
- **TypeScript (ES2022)** - Type-safe JavaScript

### Build Tool
- **Vite 5.x** - Fast build tool optimized for web components
- **Rollup** - Module bundler (used by Vite)

### State Management
- **Lit Reactive Properties** - Component-local state
- **Context API (@lit/context)** - Application state sharing
- **DataContext Pattern** - Custom context for backend data

### Routing
- **@vaadin/router** - Client-side routing for web components
- Alternative: Custom routing with History API

### Testing
- **Web Test Runner (@web/test-runner)** - Component testing
- **@open-wc/testing** - Testing utilities for web components
- **Playwright** - End-to-end testing
- **axe-core** - Accessibility testing

### Code Quality
- **ESLint** - TypeScript linting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking

### Package Manager
- **npm** - Dependency management

---

## Architecture Patterns

### Component Architecture
```
src/
├── components/              # Reusable web components
│   ├── base/               # Primitive components
│   │   ├── button/
│   │   ├── input/
│   │   └── card/
│   └── composite/          # Composite components
│       ├── forms/
│       ├── navigation/
│       └── data-display/
├── features/               # Feature modules
│   └── {feature-name}/
│       ├── components/     # Feature-specific components
│       ├── services/       # Feature services
│       ├── types.ts       # Feature types
│       └── index.ts       # Feature exports
├── services/              # Core services
│   ├── api-client.ts
│   ├── auth-service.ts
│   └── data-context.ts
├── utils/                 # Utility functions
├── types/                 # Type definitions
├── styles/                # Global styles
│   ├── tokens.css         # Design tokens
│   └── global.css         # Global styles
└── main.ts                # Application entry point
```

### State Management Pattern
```typescript
// DataContext for backend data
@provide({ context: accountContext })
export class AccountDataContext extends LitElement {
  @state() accounts: Account[] = [];
  @state() loading = false;

  async fetchAccounts() {
    this.loading = true;
    this.accounts = await accountService.getAccounts();
    this.loading = false;
  }
}

// Components consume context
@customElement('account-list')
export class AccountList extends LitElement {
  @consume({ context: accountContext, subscribe: true })
  @state()
  accounts: Account[] = [];

  render() {
    return html`
      ${this.accounts.map(account => html`
        <uwc-card>${account.name}</uwc-card>
      `)}
    `;
  }
}
```

### Service Layer Pattern
```typescript
// Adapter pattern for backend integration
export class AccountService {
  constructor(private apiClient: ApiClient) {}

  async getAccounts(): Promise<Account[]> {
    const response = await this.apiClient.get('/api/accounts');
    return response.data.map(AccountAdapter.toDomain);
  }

  async createAccount(data: CreateAccountInput): Promise<Account> {
    const payload = AccountAdapter.toApi(data);
    const response = await this.apiClient.post('/api/accounts', payload);
    return AccountAdapter.toDomain(response.data);
  }
}
```

---

## UUX Component Library

### Available Components

#### Navigation
- `<uwc-navigation-rail>` - Vertical navigation sidebar
- `<uwc-drawer>` - Slide-out navigation drawer
- `<uwc-breadcrumbs>` - Breadcrumb navigation
- `<uwc-menu-button>` - Menu dropdown button
- `<uwc-tab-bar>` - Tab navigation

#### Forms
- `<uwc-text-field>` - Text input
- `<uwc-amount-field>` - Currency/amount input
- `<uwc-select>` - Dropdown select
- `<uwc-date-picker>` - Date picker
- `<uwc-checkbox-group>` - Checkbox group
- `<uwc-radio-group>` - Radio button group
- `<uwc-button>` - Primary/secondary buttons
- `<uwc-stepper>` - Multi-step form
- `<uwc-form>` - Form container with validation

#### Data Display
- `<uwc-card>` - Content card
- `<uwc-flex-table>` - Responsive table
- `<uwc-chart>` - Charts and graphs
- `<uwc-list>` - Lists (simple, two-line, avatar)
- `<uwc-badge>` - Status badges

#### Layout
- `<uwc-dialog>` - Modal dialog
- `<uwc-expansion-panel>` - Expandable panel

#### Feedback
- `<uwc-notifications-panel>` - Toast notifications
- `<uwc-linear-progress>` - Progress indicator
- `<uwc-error-summary>` - Form error summary
- `<uwc-tooltip>` - Contextual tooltip

### UWC Component Usage Standards

#### Always Provide Labels
```html
<!-- Good: Label provided -->
<uwc-text-field label="First Name" required></uwc-text-field>

<!-- Bad: No label (accessibility issue) -->
<uwc-text-field placeholder="First Name"></uwc-text-field>
```

#### Use Error Messages
```html
<uwc-text-field
  label="Email"
  type="email"
  error-message="Please enter a valid email address"
  invalid
></uwc-text-field>
```

#### Use Design Tokens
```css
/* Good: Use design tokens */
:host {
  color: var(--uwc-color-text-primary);
  background: var(--uwc-color-surface);
  padding: var(--uwc-spacing-md);
}

/* Bad: Hardcoded values */
:host {
  color: #333333;
  background: #ffffff;
  padding: 16px;
}
```

#### Responsive Components
```html
<uwc-flex-table responsive>
  <table>
    <thead>
      <tr>
        <th>Account</th>
        <th>Balance</th>
      </tr>
    </thead>
  </table>
</uwc-flex-table>
```

---

## Design Tokens

### UWC Token Categories

#### Colors
```css
/* Text colors */
--uwc-color-text-primary
--uwc-color-text-secondary
--uwc-color-text-disabled
--uwc-color-text-on-primary

/* Surface colors */
--uwc-color-surface
--uwc-color-surface-variant
--uwc-color-background

/* Brand colors */
--uwc-color-primary
--uwc-color-secondary
--uwc-color-error
--uwc-color-warning
--uwc-color-success
--uwc-color-info
```

#### Spacing
```css
--uwc-spacing-xs   /* 4px */
--uwc-spacing-sm   /* 8px */
--uwc-spacing-md   /* 16px */
--uwc-spacing-lg   /* 24px */
--uwc-spacing-xl   /* 32px */
```

#### Typography
```css
--uwc-font-family-base
--uwc-font-size-xs
--uwc-font-size-sm
--uwc-font-size-md
--uwc-font-size-lg
--uwc-font-size-xl
--uwc-font-weight-normal
--uwc-font-weight-medium
--uwc-font-weight-bold
```

#### Elevation
```css
--uwc-elevation-1  /* Card */
--uwc-elevation-2  /* Raised card */
--uwc-elevation-3  /* Dialog */
```

---

## Development Workflow

### Setup
```bash
npm install
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Testing
```bash
npm test                    # Run unit tests
npm run test:watch          # Watch mode
npm run test:coverage       # Generate coverage report
npm run test:e2e            # Run end-to-end tests
npm run test:accessibility  # Run accessibility tests
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

---

## Configuration Files

### package.json (Key Dependencies)
```json
{
  "dependencies": {
    "lit": "^3.0.0",
    "@unified-ux/uux-web": "^latest",
    "@lit/context": "^1.0.0",
    "@vaadin/router": "^1.7.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@web/test-runner": "^0.18.0",
    "@open-wc/testing": "^4.0.0",
    "playwright": "^1.40.0",
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.18.0",
    "prettier": "^3.1.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "skipLibCheck": true
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      entry: 'src/main.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

---

## Quality Standards

### Component Standards
- **Single Responsibility:** Each component has one clear purpose
- **Composability:** Components can be composed together
- **Reusability:** Components are generic and configurable via props
- **Accessibility:** All components meet WCAG 2.2 AA
- **Performance:** First render < 16ms (60fps)

### Code Standards
- **TypeScript strict mode:** No `any` types
- **Test coverage:** >80% for business logic
- **Accessibility:** 100% keyboard navigable
- **Design system:** Use UWC components exclusively
- **Design tokens:** No hardcoded colors, spacing, typography

### File Standards
- **Naming:** kebab-case (`my-component.ts`)
- **Size:** Components < 300 lines (split if larger)
- **Exports:** One main export per file
- **Imports:** Grouped (external, internal, relative)

---

## Performance Optimization

### Lazy Loading
```typescript
// Lazy load features
const loadAccountModule = () => import('./features/account');

router.setRoutes([
  {
    path: '/accounts',
    action: async () => {
      await loadAccountModule();
      return html`<account-dashboard></account-dashboard>`;
    }
  }
]);
```

### Virtual Scrolling
```html
<!-- Use virtual scrolling for long lists -->
<lit-virtualizer
  .items=${this.transactions}
  .renderItem=${item => html`<transaction-row .data=${item}></transaction-row>`}
></lit-virtualizer>
```

### Memoization
```typescript
import { cache } from 'lit/directives/cache.js';

render() {
  return cache(
    this.viewMode === 'list'
      ? html`<account-list></account-list>`
      : html`<account-grid></account-grid>`
  );
}
```

---

## Accessibility Requirements

### WCAG 2.2 AA Compliance
- **Keyboard Navigation:** All functionality via keyboard
- **Screen Reader:** Proper ARIA labels and roles
- **Color Contrast:** 4.5:1 for text, 3:1 for UI components
- **Focus Management:** Visible focus indicators
- **Error Handling:** Clear error messages with suggestions

### Implementation
```typescript
@customElement('my-button')
export class MyButton extends LitElement {
  @property({ type: Boolean }) disabled = false;

  render() {
    return html`
      <button
        ?disabled=${this.disabled}
        aria-label="Submit form"
        @click=${this.handleClick}
      >
        <slot></slot>
      </button>
    `;
  }
}
```

---

## Security Standards

### XSS Prevention
```typescript
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

render() {
  // Good: Lit automatically escapes
  return html`<div>${userInput}</div>`;

  // Bad: Unsafe HTML (only if needed and sanitized)
  return html`<div>${unsafeHTML(sanitized(userInput))}</div>`;
}
```

### CSRF Protection
```typescript
// Include CSRF token in API calls
const response = await fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCsrfToken()
  },
  body: JSON.stringify(data)
});
```

---

## Common Patterns

### Form Handling
```typescript
@customElement('payment-form')
export class PaymentForm extends LitElement {
  @state() formData = { amount: '', recipient: '' };
  @state() errors: Record<string, string> = {};

  handleSubmit(e: Event) {
    e.preventDefault();
    this.errors = this.validate(this.formData);

    if (Object.keys(this.errors).length === 0) {
      this.submitForm();
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <uwc-amount-field
          label="Amount"
          .value=${this.formData.amount}
          @input=${(e) => this.formData.amount = e.target.value}
          error-message=${this.errors.amount}
          ?invalid=${!!this.errors.amount}
        ></uwc-amount-field>

        <uwc-button type="submit">Submit</uwc-button>
      </form>
    `;
  }
}
```

### Loading States
```typescript
@state() loading = false;
@state() data: Account[] = [];

async fetchData() {
  this.loading = true;
  try {
    this.data = await accountService.getAccounts();
  } finally {
    this.loading = false;
  }
}

render() {
  if (this.loading) {
    return html`<uwc-linear-progress></uwc-linear-progress>`;
  }
  return html`<account-list .accounts=${this.data}></account-list>`;
}
```

---

## Verification Checklist

- [ ] Uses UWC components (not custom form controls)
- [ ] Design tokens used (no hardcoded values)
- [ ] TypeScript strict mode enabled
- [ ] All components have tests (>80% coverage)
- [ ] WCAG 2.2 AA compliant
- [ ] Keyboard accessible
- [ ] Responsive (320px-2560px)
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] No console errors or warnings

---

## Related Documents

- [TypeScript Coding Standards](../../standards/coding-conventions/typescript-coding-standards.md)
- [Quality Standards](../../standards/quality-standards.md)
- [Accessibility Standards](../../standards/accessibility-standards.md)
- [Security Standards](../../standards/security-standards.md)

---

## Resources

- **UUX Documentation:** https://developer.temenos.com/uux
- **Lit Documentation:** https://lit.dev
- **Vite Documentation:** https://vitejs.dev
- **Web Components:** https://developer.mozilla.org/en-US/docs/Web/Web_Components

---

**Maintained By:** Temenos UUX Team
**Support:** uux-support@temenos.com
