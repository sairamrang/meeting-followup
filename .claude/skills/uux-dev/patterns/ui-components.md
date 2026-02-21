# UI Component Patterns

## Overview

Frontend UI uses:
- **Lit 3.x** - Web components framework
- **UUX Components** - All 58 `<uwc-*>` components
- **TypeScript** - Strict typing required
- **Design Tokens** - CSS custom properties (`var(--uwc-*)`)
- **WCAG 2.2 AA** - Accessibility compliance mandatory

### Design System References (Self-Contained)

For UWC component APIs and usage, see the skill's bundled design system:
- [../reference/components-catalog.md](../reference/components-catalog.md) - Component catalog overview
- [../reference/components/](../reference/components/) - Detailed component documentation
- [../reference/foundations/07-design-tokens.md](../reference/foundations/07-design-tokens.md) - CSS custom properties
- [../reference/dialog-patterns.md](../reference/dialog-patterns.md) - Dialog best practices

---

## Component Structure

**Template:** [../templates/component-base.template.ts](../templates/component-base.template.ts)

```typescript
/**
 * [Component Name]
 * [Description of functionality]
 *
 * @fires [event-name] - [When/why fired] - Detail: { [fields] }
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// TypeScript interfaces
interface DataType {
  // properties
}

@customElement('[component-name]')
export class ComponentName extends LitElement {
  // Styles (design tokens only)
  static styles = css`
    :host {
      display: block;
    }

    .container {
      padding: var(--uwc-spacing-3);
      gap: var(--uwc-spacing-2);
    }
  `;

  // Public properties (@property)
  @property({ type: String })
  title = '';

  // Private state (@state)
  @state()
  private isLoading = false;

  // Event handlers (private methods)
  private handleAction() {
    this.dispatchEvent(
      new CustomEvent('action-triggered', {
        detail: { /* event data */ },
        bubbles: true,
        composed: true
      })
    );
  }

  // Render method (UWC components only!)
  render() {
    return html`
      <uwc-card>
        <h2 slot="header">${this.title}</h2>
        ${this.isLoading
          ? html`<uwc-linear-progress></uwc-linear-progress>`
          : html`
              <uwc-button variant="filled" @click=${this.handleAction}>
                Action
              </uwc-button>
            `}
      </uwc-card>
    `;
  }
}
```

---

## Pattern: Form Component

**Template:** [../templates/form-component.template.ts](../templates/form-component.template.ts)

```typescript
@customElement("user-form")
export class UserForm extends LitElement {
  @property({ type: Object })
  user?: User;

  @state()
  private formData: Partial<User> = {};

  @state()
  private errors: Record<string, string> = {};

  private handleSubmit(e: Event) {
    e.preventDefault();

    // Validate
    this.errors = this.validate(this.formData);

    if (Object.keys(this.errors).length === 0) {
      this.dispatchEvent(
        new CustomEvent("form-submitted", {
          detail: { user: this.formData },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private validate(data: Partial<User>): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!data.email) errors.email = "Email is required";
    if (!data.name) errors.name = "Name is required";
    return errors;
  }

  render() {
    return html`
      <uwc-form @submit=${this.handleSubmit}>
        <uwc-text-field
          label="Name"
          .value=${this.formData.name || ''}
          @input=${(e: any) => this.formData = {...this.formData, name: e.target.value}}
          required
          ?error=${!!this.errors.name}
          .validationMessage=${this.errors.name}>
        </uwc-text-field>

        <uwc-text-field
          label="Email"
          type="email"
          .value=${this.formData.email || ''}
          @input=${(e: any) => this.formData = {...this.formData, email: e.target.value}}
          required
          ?error=${!!this.errors.email}
          .validationMessage=${this.errors.email}>
        </uwc-text-field>

        <div class="actions">
          <uwc-button variant="outlined" type="button">Cancel</uwc-button>
          <uwc-button variant="filled" type="submit">Save</uwc-button>
        </div>
      </uwc-form>
    `;
  }
}
```

---

## Pattern: Container Component

**Template:** [../templates/container-component.template.ts](../templates/container-component.template.ts)

```typescript
@customElement("dashboard-page")
export class DashboardPage extends LitElement {
  @state()
  private data: DashboardData | null = null;

  @state()
  private isLoading = true;

  @state()
  private error: string | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  private async loadData() {
    this.isLoading = true;
    try {
      this.data = await fetchDashboardData();
      this.error = null;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load data";
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    if (this.isLoading) {
      return html`<uwc-linear-progress></uwc-linear-progress>`;
    }

    if (this.error) {
      return html`
        <uwc-error-summary>
          <p>${this.error}</p>
          <uwc-button variant="outlined" @click="${this.loadData}">
            Retry
          </uwc-button>
        </uwc-error-summary>
      `;
    }

    return html`
      <uwc-card>
        <h1 slot="header">Dashboard</h1>
        <!-- Dashboard content -->
      </uwc-card>
    `;
  }
}
```

---

## Pattern: Dialog Usage (CRITICAL)

**CRITICAL:** Always consult official UUX docs before implementing dialogs!
- @docs/uux-docs/components/dialog/code.mdx
- @docs/uux-docs/components/dialog/usage.mdx

**Template:** [../templates/dialog-pattern.template.ts](../templates/dialog-pattern.template.ts)

### Correct UWC Dialog API

```typescript
@customElement("confirmation-dialog-example")
export class ConfirmationDialogExample extends LitElement {
  @state()
  private selectedItem: Item | null = null;

  private showDeleteDialog(): void {
    const dialog = this.shadowRoot?.getElementById("deleteDialog") as any;
    if (dialog) {
      dialog.show(); // CORRECT: Use .show() method
    }
  }

  private closeDialog(): void {
    const dialog = this.shadowRoot?.getElementById("deleteDialog") as any;
    if (dialog) {
      dialog.close(); // CORRECT: Use .close() method
    }
  }

  private handleDelete(): void {
    console.log("Deleting:", this.selectedItem);
    this.closeDialog();
  }

  render() {
    return html`
      <!-- Button to open dialog -->
      <uwc-button label="Delete Item" @click=${this.showDeleteDialog}>
      </uwc-button>

      <!-- Dialog - CORRECT API -->
      <uwc-dialog id="deleteDialog" heading="Confirm Deletion">
        <p>Are you sure you want to delete "${this.selectedItem?.name}"?</p>
        <p>This action cannot be undone.</p>

        <!-- Use slot="secondaryAction" for cancel button -->
        <uwc-button
          label="Cancel"
          dialogAction="cancel"
          slot="secondaryAction"
          @click=${this.closeDialog}
        >
        </uwc-button>

        <!-- Use slot="primaryAction" for confirm button -->
        <uwc-button
          label="Delete"
          dialogAction="delete"
          slot="primaryAction"
          @click=${this.handleDelete}
        >
        </uwc-button>
      </uwc-dialog>
    `;
  }
}
```

### Critical API Requirements

- Use `heading` attribute for title (NOT `slot="header"`)
- Use `.show()` method to open (NOT `?open=${state}` or `.open()`)
- Use `.close()` method to close
- Place content directly inside dialog (NO `slot="content"` wrapper)
- Use `slot="primaryAction"` for primary/confirm button
- Use `slot="secondaryAction"` for secondary/cancel button
- Use `dialogAction` attribute on buttons for built-in close behavior

### WRONG Patterns (Do NOT use)

```html
<!-- WRONG - Don't use these patterns -->
<uwc-dialog ?open="${this.isOpen}"><!-- Wrong: No ?open property -->
  <h2 slot="header">Title</h2><!-- Wrong: No slot="header" -->
  <div slot="content">Content</div><!-- Wrong: No slot="content" -->
  <div slot="actions"><!-- Wrong: No slot="actions" -->
    <uwc-button>OK</uwc-button>
  </div>
</uwc-dialog>

<script>
  dialog.open(); // Wrong: Use .show() instead
</script>
```

---

## Property vs Attribute Syntax

```typescript
// CORRECT: Use attributes for most UWC component properties
<uwc-button
  label="Click Me"         // Attribute (no dot prefix)
  outlined                 // Boolean attribute
  @click=${handler}>       // Event listener
</uwc-button>

// WRONG: Don't use property syntax on UWC components
<uwc-button
  .label=${'Click Me'}     // Property syntax (causes rendering issues)
  ?outlined=${true}        // Boolean property (causes rendering issues)
>
</uwc-button>

// EXCEPTION: Use property syntax (.prefix) only for dynamic object/array values
<uwc-select
  label="Choose Option"     // Attribute for string
  .value=${this.selected}>  // Property for dynamic value binding
</uwc-select>
```

---

## TypeScript Patterns

### Define Interfaces

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Type component properties
@property({ type: Object })
user!: User;
```

### Type Event Details

```typescript
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

## Design Tokens

```css
/* CORRECT */
.custom-element {
  color: var(--uwc-color-brand-primary);
  padding: var(--uwc-spacing-3);
  font-size: var(--uwc-font-size-body);
}

/* WRONG - No hard-coded values */
.custom-element {
  color: #4a5798;
  padding: 24px;
  font-size: 14px;
}
```

---

## Accessibility

```html
<!-- CORRECT -->
<uwc-icon-button
  icon="delete"
  ariaLabel="Delete user"
  @click="${this.handleDelete}"
>
</uwc-icon-button>

<!-- WRONG - Missing aria-label -->
<uwc-icon-button icon="delete" @click="${this.handleDelete}">
</uwc-icon-button>
```

---

## Event Dispatching

Always use `CustomEvent` with proper typing:

```typescript
private handleUserAction(user: User) {
  this.dispatchEvent(
    new CustomEvent('user-action', {
      detail: {
        userId: user.id,
        action: 'selected',
        timestamp: Date.now()
      },
      bubbles: true,    // Allow parent elements to listen
      composed: true    // Cross shadow DOM boundary
    })
  );
}
```
