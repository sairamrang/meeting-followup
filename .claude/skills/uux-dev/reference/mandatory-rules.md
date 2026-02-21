# Mandatory Rules

Non-negotiable rules for UUX development.

---

## 1. UWC Components ONLY

```html
<!-- ✓ CORRECT -->
<uwc-button variant="filled">Save</uwc-button>
<uwc-text-field label="Email" type="email" required></uwc-text-field>

<!-- ✗ WRONG - Never create custom buttons/inputs -->
<button class="custom-btn">Save</button>
<input type="email" class="custom-input" />
```

---

## 2. Lit 3.x Patterns

```typescript
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("my-component")
export class MyComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: var(--uwc-spacing-3);
    }
  `;

  @property({ type: String })
  title = "";

  @state()
  private isLoading = false;

  render() {
    return html`
      <uwc-card>
        <h2 slot="header">${this.title}</h2>
        <!-- Content -->
      </uwc-card>
    `;
  }
}
```

---

## 3. TypeScript Interfaces

```typescript
// Define interfaces for all data structures
interface User {
  id: string;
  name: string;
  email: string;
}

// Type component properties
@property({ type: Object })
user!: User;

// Type event details
interface UserSelectedEvent {
  userId: string;
  timestamp: number;
}

this.dispatchEvent(new CustomEvent<UserSelectedEvent>('user-selected', {
  detail: { userId: user.id, timestamp: Date.now() },
  bubbles: true,
  composed: true
}));
```

---

## 4. Design Tokens ONLY

```css
/* ✓ CORRECT */
.custom-element {
  color: var(--uwc-color-brand-primary);
  padding: var(--uwc-spacing-3);
  font-size: var(--uwc-font-size-body);
}

/* ✗ WRONG - No hard-coded values */
.custom-element {
  color: #4a5798;
  padding: 24px;
  font-size: 14px;
}
```

---

## 5. Accessibility Required

```html
<!-- ✓ CORRECT -->
<uwc-icon-button
  icon="delete"
  ariaLabel="Delete user"
  @click="${this.handleDelete}"
>
</uwc-icon-button>

<!-- ✗ WRONG - Missing aria-label -->
<uwc-icon-button icon="delete" @click="${this.handleDelete}">
</uwc-icon-button>
```

### Accessibility Checklist

- ARIA labels on all icon buttons
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements for dynamic content
- Sufficient color contrast
- Focus indicators visible
- Form error messages announced

---

## 6. DataContext for State

Components consume state from DataContext, they don't manage it:

```typescript
import { consume } from "@lit/context";
import { dataContext, DataContext } from "../../contexts/data-context.js";

@customElement("my-component")
export class MyComponent extends LitElement {
  @consume({ context: dataContext, subscribe: true })
  @property({ attribute: false })
  data!: DataContext;

  override async connectedCallback() {
    super.connectedCallback();
    await this.data.refreshFeature();
  }

  override render() {
    const items = this.data.feature;
    const isLoading = this.data.loading.feature;
    // ...
  }
}
```

---

## 7. No localStorage

**CRITICAL:** All data flows through backend API.

```typescript
// ✗ WRONG
localStorage.setItem("user", JSON.stringify(user));

// ✓ CORRECT
await api.POST("/api/v1/users", { body: user });
```

---

## 8. ISO Date Strings

Use ISO strings for dates in JSON:

```typescript
// ✓ CORRECT
interface Entity {
  createdDate: string;  // "2025-01-15T14:30:00.000Z"
  targetDate: string;   // ISO string
}

// ✗ WRONG
interface Entity {
  createdDate: Date;    // Date objects don't serialize properly
}
```

---

## 9. Event Dispatching

Always use CustomEvent with proper typing:

```typescript
private handleAction(item: Item) {
  this.dispatchEvent(
    new CustomEvent('item-action', {
      detail: {
        itemId: item.id,
        action: 'selected',
        timestamp: Date.now()
      },
      bubbles: true,    // Allow parent elements to listen
      composed: true    // Cross shadow DOM boundary
    })
  );
}
```

---

## 10. Property vs Attribute Syntax

```typescript
// ✓ CORRECT: Use attributes for most UWC component properties
<uwc-button
  label="Click Me"         // Attribute (no dot prefix)
  outlined                 // Boolean attribute
  @click=${handler}>       // Event listener
</uwc-button>

// ✗ WRONG: Don't use property syntax on UWC components
<uwc-button
  .label=${'Click Me'}     // Property syntax (causes issues)
  ?outlined=${true}>       // Boolean property (causes issues)
</uwc-button>

// EXCEPTION: Use property syntax only for dynamic object/array values
<uwc-select
  label="Choose Option"     // Attribute for string
  .value=${this.selected}>  // Property for dynamic binding
</uwc-select>
```
