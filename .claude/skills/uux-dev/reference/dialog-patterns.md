# Dialog Patterns & Best Practices

**Complete reference for implementing UWC dialogs correctly**

> **CRITICAL:** Always consult official UUX documentation first:
> - `docs/uux-docs/components/dialog/code.mdx` - API reference
> - `docs/uux-docs/components/dialog/usage.mdx` - Usage guidelines
> - `docs/uux-docs/components/dialog/examples.js` - Code examples

---

## Quick Reference

### Correct Dialog API

```html
<uwc-dialog id="myDialog" heading="Dialog Title">
  <!-- Content goes directly here (no slot="content") -->
  <p>Dialog content</p>

  <!-- Secondary action (Cancel/Close) -->
  <uwc-button
    label="Cancel"
    dialogAction="cancel"
    slot="secondaryAction">
  </uwc-button>

  <!-- Primary action (Confirm/Submit) -->
  <uwc-button
    label="Confirm"
    dialogAction="confirm"
    slot="primaryAction">
  </uwc-button>
</uwc-dialog>
```

```typescript
// Open dialog
const dialog = document.getElementById('myDialog') as any;
dialog.show();

// Close dialog
dialog.close();
```

### Critical API Requirements

- ✅ Use `heading` attribute for title (NOT `slot="header"`)
- ✅ Use `.show()` method to open (NOT `?open=${state}` or `.open()`)
- ✅ Use `.close()` method to close
- ✅ Place content directly inside (NO `slot="content"` wrapper)
- ✅ Use `slot="primaryAction"` for primary button
- ✅ Use `slot="secondaryAction"` for secondary button
- ✅ Use `dialogAction` attribute on buttons

---

## Common Dialog Types

### 1. Confirmation Dialog

Use for destructive actions that need user confirmation.

```typescript
@customElement('delete-confirmation')
export class DeleteConfirmation extends LitElement {
  @state()
  private itemToDelete: Item | null = null;

  private showDeleteDialog(item: Item): void {
    this.itemToDelete = item;
    const dialog = this.shadowRoot?.getElementById('deleteDialog') as any;
    dialog?.show();
  }

  private closeDialog(): void {
    const dialog = this.shadowRoot?.getElementById('deleteDialog') as any;
    dialog?.close();
    this.itemToDelete = null;
  }

  private async handleDelete(): Promise<void> {
    if (!this.itemToDelete) return;

    try {
      await deleteItem(this.itemToDelete.id);
      this.closeDialog();
      // Show success feedback
    } catch (error) {
      // Handle error
    }
  }

  render() {
    return html`
      <uwc-dialog id="deleteDialog" heading="Delete Item?">
        <p>
          Are you sure you want to delete "${this.itemToDelete?.name}"?
        </p>
        <p>This action cannot be undone.</p>

        <uwc-button
          label="Cancel"
          dialogAction="cancel"
          slot="secondaryAction"
          @click=${this.closeDialog}>
        </uwc-button>

        <uwc-button
          label="Delete"
          dialogAction="delete"
          slot="primaryAction"
          @click=${this.handleDelete}>
        </uwc-button>
      </uwc-dialog>
    `;
  }
}
```

**Best Practices:**
- Clearly state what will be deleted
- Warn if action is irreversible
- Use destructive button styling for primary action
- Show item name/identifier in message

---

### 2. Form Dialog

Use for collecting user input or editing data.

```typescript
@customElement('edit-profile-dialog')
export class EditProfileDialog extends LitElement {
  @state()
  private name = '';

  @state()
  private email = '';

  @state()
  private errors: Record<string, string> = {};

  private showDialog(user: User): void {
    this.name = user.name;
    this.email = user.email;
    this.errors = {};

    const dialog = this.shadowRoot?.getElementById('profileDialog') as any;
    dialog?.show();
  }

  private closeDialog(): void {
    const dialog = this.shadowRoot?.getElementById('profileDialog') as any;
    dialog?.close();
  }

  private validate(): boolean {
    this.errors = {};

    if (!this.name.trim()) {
      this.errors.name = 'Name is required';
    }

    if (!this.email.trim()) {
      this.errors.email = 'Email is required';
    } else if (!this.email.includes('@')) {
      this.errors.email = 'Invalid email format';
    }

    return Object.keys(this.errors).length === 0;
  }

  private async handleSave(): Promise<void> {
    if (!this.validate()) {
      return;
    }

    try {
      await saveProfile({ name: this.name, email: this.email });
      this.closeDialog();
      // Show success feedback
    } catch (error) {
      // Handle error
    }
  }

  render() {
    return html`
      <uwc-dialog id="profileDialog" heading="Edit Profile">
        <!-- Form fields - no slot="content" wrapper -->
        <uwc-text-field
          label="Name"
          .value=${this.name}
          @input=${(e: any) => {
            this.name = e.target.value;
            delete this.errors.name;
          }}
          required
          helper-text="Your full name"
          aria-invalid=${!!this.errors.name}>
        </uwc-text-field>
        ${this.errors.name
          ? html`<div class="error">${this.errors.name}</div>`
          : ''}

        <uwc-text-field
          label="Email"
          type="email"
          .value=${this.email}
          @input=${(e: any) => {
            this.email = e.target.value;
            delete this.errors.email;
          }}
          required
          helper-text="Your email address"
          aria-invalid=${!!this.errors.email}>
        </uwc-text-field>
        ${this.errors.email
          ? html`<div class="error">${this.errors.email}</div>`
          : ''}

        <uwc-button
          label="Cancel"
          dialogAction="cancel"
          slot="secondaryAction"
          @click=${this.closeDialog}>
        </uwc-button>

        <uwc-button
          label="Save"
          dialogAction="save"
          slot="primaryAction"
          @click=${this.handleSave}>
        </uwc-button>
      </uwc-dialog>
    `;
  }
}
```

**Best Practices:**
- Validate before save
- Show inline error messages
- Clear errors when user starts typing
- Reset form state on cancel
- Focus first field when dialog opens
- Show loading state during save

---

### 3. Alert/Information Dialog

Use for important messages or notifications.

```typescript
@customElement('success-alert')
export class SuccessAlert extends LitElement {
  private showAlert(message: string): void {
    const dialog = this.shadowRoot?.getElementById('alertDialog') as any;
    dialog?.show();
  }

  private closeDialog(): void {
    const dialog = this.shadowRoot?.getElementById('alertDialog') as any;
    dialog?.close();
  }

  render() {
    return html`
      <uwc-dialog id="alertDialog" heading="Success">
        <p>Your changes have been saved successfully.</p>

        <!-- Single action - only primary button -->
        <uwc-button
          label="OK"
          dialogAction="close"
          slot="primaryAction"
          @click=${this.closeDialog}>
        </uwc-button>
      </uwc-dialog>
    `;
  }
}
```

**Best Practices:**
- Use single action button for acknowledgment
- Keep message concise and clear
- Consider using toast notifications instead for non-critical info
- Use appropriate heading (Success, Warning, Error, Info)

---

### 4. Multi-Step Dialog (Wizard)

Use for complex workflows broken into steps.

```typescript
@customElement('setup-wizard')
export class SetupWizard extends LitElement {
  @state()
  private currentStep = 1;

  @state()
  private totalSteps = 3;

  private showWizard(): void {
    this.currentStep = 1;
    const dialog = this.shadowRoot?.getElementById('wizardDialog') as any;
    dialog?.show();
  }

  private nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  private previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private closeDialog(): void {
    const dialog = this.shadowRoot?.getElementById('wizardDialog') as any;
    dialog?.close();
  }

  private async handleComplete(): Promise<void> {
    // Save all data
    this.closeDialog();
  }

  render() {
    return html`
      <uwc-dialog id="wizardDialog" heading="Setup Wizard - Step ${this.currentStep} of ${this.totalSteps}">
        <!-- Step content -->
        ${this.currentStep === 1 ? this.renderStep1() : ''}
        ${this.currentStep === 2 ? this.renderStep2() : ''}
        ${this.currentStep === 3 ? this.renderStep3() : ''}

        <!-- Navigation buttons -->
        ${this.currentStep > 1
          ? html`
              <uwc-button
                label="Back"
                dialogAction=""
                slot="secondaryAction"
                @click=${this.previousStep}>
              </uwc-button>
            `
          : html`
              <uwc-button
                label="Cancel"
                dialogAction="cancel"
                slot="secondaryAction"
                @click=${this.closeDialog}>
              </uwc-button>
            `}

        <uwc-button
          label=${this.currentStep < this.totalSteps ? 'Next' : 'Complete'}
          dialogAction=""
          slot="primaryAction"
          @click=${this.currentStep < this.totalSteps ? this.nextStep : this.handleComplete}>
        </uwc-button>
      </uwc-dialog>
    `;
  }
}
```

**Best Practices:**
- Show progress indicator (step X of Y)
- Validate each step before allowing next
- Allow back navigation
- Save progress (if needed)
- Provide clear step labels

---

## State Management Patterns

### Pattern 1: Dialog State in Parent Component

```typescript
@customElement('user-list')
export class UserList extends LitElement {
  @state()
  private selectedUser: User | null = null;

  private openEditDialog(user: User): void {
    this.selectedUser = user;
    // Wait for render cycle
    this.requestUpdate();
    setTimeout(() => {
      const dialog = this.shadowRoot?.getElementById('editDialog') as any;
      dialog?.show();
    }, 0);
  }

  private closeEditDialog(): void {
    const dialog = this.shadowRoot?.getElementById('editDialog') as any;
    dialog?.close();
    this.selectedUser = null;
  }

  render() {
    return html`
      <!-- List content -->

      <!-- Dialog conditionally rendered based on selection -->
      <uwc-dialog id="editDialog" heading="Edit User">
        ${this.selectedUser
          ? html`
              <edit-user-form
                .user=${this.selectedUser}
                @save=${this.closeEditDialog}>
              </edit-user-form>
            `
          : ''}
      </uwc-dialog>
    `;
  }
}
```

### Pattern 2: Dialog as Separate Component

```typescript
// Parent component
@customElement('dashboard')
export class Dashboard extends LitElement {
  private openConfirmDialog(): void {
    const dialog = this.shadowRoot?.querySelector('confirm-dialog') as any;
    dialog?.show();
  }

  render() {
    return html`
      <uwc-button label="Delete All" @click=${this.openConfirmDialog}></uwc-button>
      <confirm-dialog @confirmed=${this.handleDeleteAll}></confirm-dialog>
    `;
  }
}

// Dialog component
@customElement('confirm-dialog')
export class ConfirmDialog extends LitElement {
  public show(): void {
    const dialog = this.shadowRoot?.getElementById('dialog') as any;
    dialog?.show();
  }

  private close(): void {
    const dialog = this.shadowRoot?.getElementById('dialog') as any;
    dialog?.close();
  }

  private handleConfirm(): void {
    this.dispatchEvent(new CustomEvent('confirmed', { bubbles: true, composed: true }));
    this.close();
  }

  render() {
    return html`
      <uwc-dialog id="dialog" heading="Confirm">
        <p>Are you sure?</p>
        <uwc-button label="Cancel" slot="secondaryAction" @click=${this.close}></uwc-button>
        <uwc-button label="Confirm" slot="primaryAction" @click=${this.handleConfirm}></uwc-button>
      </uwc-dialog>
    `;
  }
}
```

---

## Common Mistakes & Fixes

### ❌ Mistake 1: Using Wrong Slot Names

```html
<!-- WRONG -->
<uwc-dialog>
  <h2 slot="header">Title</h2>
  <div slot="content">Content</div>
  <div slot="actions">
    <uwc-button>OK</uwc-button>
  </div>
</uwc-dialog>
```

```html
<!-- CORRECT -->
<uwc-dialog heading="Title">
  <p>Content</p>
  <uwc-button label="OK" slot="primaryAction"></uwc-button>
</uwc-dialog>
```

### ❌ Mistake 2: Using Property Binding to Control Dialog

```html
<!-- WRONG -->
<uwc-dialog ?open=${this.showDialog}>
  <p>Content</p>
</uwc-dialog>
```

```typescript
// CORRECT
private openDialog(): void {
  const dialog = this.shadowRoot?.getElementById('myDialog') as any;
  dialog?.show();
}
```

### ❌ Mistake 3: Using .open() Instead of .show()

```typescript
// WRONG
dialog.open();

// CORRECT
dialog.show();
```

### ❌ Mistake 4: Using Property Syntax on UWC Components

```html
<!-- WRONG -->
<uwc-button
  .label=${'Click Me'}
  ?contained=${true}>
</uwc-button>
```

```html
<!-- CORRECT -->
<uwc-button
  label="Click Me"
  contained>
</uwc-button>
```

---

## Accessibility Checklist

- [ ] Dialog has meaningful `heading` attribute
- [ ] Focus moves to dialog when opened
- [ ] Focus is trapped within dialog (handled by UWC)
- [ ] ESC key closes dialog (handled by UWC)
- [ ] Focus returns to trigger element on close
- [ ] Buttons have clear labels
- [ ] Form fields have labels
- [ ] Error messages are announced
- [ ] Loading states are announced

---

## Performance Best Practices

- **Lazy Load Content**: Only render dialog content when needed
- **Dispose Resources**: Clean up event listeners and data when dialog closes
- **Avoid Nested Dialogs**: Use single dialog with steps instead
- **Limit Dialog Size**: Keep content focused and minimal
- **Optimize Renders**: Use `@state` for dialog-specific state

---

## Testing Checklist

- [ ] Dialog opens correctly
- [ ] Dialog closes correctly
- [ ] Primary action works
- [ ] Secondary action works
- [ ] Close button works (if present)
- [ ] ESC key closes dialog
- [ ] Clicking scrim/backdrop closes dialog (if enabled)
- [ ] Form validation works (if applicable)
- [ ] Data is saved correctly (if applicable)
- [ ] Error handling works
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly

---

## References

**Official UUX Documentation:**
- `docs/uux-docs/components/dialog/code.mdx` - Complete API reference
- `docs/uux-docs/components/dialog/usage.mdx` - Usage guidelines
- `docs/uux-docs/components/dialog/examples.js` - Working examples

**Design System:**
- `.claude/skills/uux-dev/reference/components/layout-containers.md` - Quick reference
- `.claude/skills/uux-dev/reference/components-catalog.md` - Component catalog

**Working Examples in Codebase:**
- Search for `<uwc-dialog` in `src/components/` to see real implementations
