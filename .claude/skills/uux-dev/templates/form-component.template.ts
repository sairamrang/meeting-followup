/**
 * {Entity} Form
 * Form component with validation and error handling
 *
 * @fires form-submitted - When form is successfully submitted - Detail: { entity: EntityData }
 * @fires form-cancelled - When form is cancelled
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// TypeScript interfaces
interface EntityData {
  id?: string;
  name: string;
  email: string;
  description?: string;
}

interface FormSubmittedEvent {
  entity: EntityData;
}

@customElement("entity-form")
export class EntityForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: var(--uwc-spacing-2);
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--uwc-spacing-2);
      margin-top: var(--uwc-spacing-3);
    }
  `;

  // Existing entity for editing (optional)
  @property({ type: Object })
  entity?: EntityData;

  // Form state
  @state()
  private formData: Partial<EntityData> = {};

  @state()
  private errors: Record<string, string> = {};

  @state()
  private isSubmitting = false;

  // Initialize form data when entity changes
  override willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("entity") && this.entity) {
      this.formData = { ...this.entity };
    }
  }

  // Validation
  private validate(data: Partial<EntityData>): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = "Name is required";
    }

    if (!data.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    return errors;
  }

  // Form submission
  private handleSubmit(e: Event) {
    e.preventDefault();

    // Validate
    this.errors = this.validate(this.formData);

    if (Object.keys(this.errors).length === 0) {
      this.isSubmitting = true;

      this.dispatchEvent(
        new CustomEvent<FormSubmittedEvent>("form-submitted", {
          detail: { entity: this.formData as EntityData },
          bubbles: true,
          composed: true,
        }),
      );

      // Reset after dispatch (parent handles API call)
      this.isSubmitting = false;
    }
  }

  private handleCancel() {
    this.formData = this.entity ? { ...this.entity } : {};
    this.errors = {};

    this.dispatchEvent(
      new CustomEvent("form-cancelled", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Field update helper
  private updateField(field: keyof EntityData, value: string) {
    this.formData = { ...this.formData, [field]: value };

    // Clear error when user starts typing
    if (this.errors[field]) {
      const newErrors = { ...this.errors };
      delete newErrors[field];
      this.errors = newErrors;
    }
  }

  render() {
    return html`
      <uwc-form @submit=${this.handleSubmit}>
        <div class="form-container">
          <uwc-text-field
            label="Name"
            .value=${this.formData.name || ""}
            @input=${(e: any) => this.updateField("name", e.target.value)}
            required
            ?error=${!!this.errors.name}
            .validationMessage=${this.errors.name}
          >
          </uwc-text-field>

          <uwc-text-field
            label="Email"
            type="email"
            .value=${this.formData.email || ""}
            @input=${(e: any) => this.updateField("email", e.target.value)}
            required
            ?error=${!!this.errors.email}
            .validationMessage=${this.errors.email}
          >
          </uwc-text-field>

          <uwc-text-area
            label="Description"
            .value=${this.formData.description || ""}
            @input=${(e: any) =>
              this.updateField("description", e.target.value)}
            rows="3"
          >
          </uwc-text-area>
        </div>

        <div class="actions">
          <uwc-button
            variant="outlined"
            type="button"
            label="Cancel"
            @click=${this.handleCancel}
          >
          </uwc-button>
          <uwc-button
            variant="filled"
            type="submit"
            label=${this.entity ? "Update" : "Create"}
            ?disabled=${this.isSubmitting}
          >
          </uwc-button>
        </div>
      </uwc-form>
    `;
  }
}
