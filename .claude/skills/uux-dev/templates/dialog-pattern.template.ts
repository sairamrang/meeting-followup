/**
 * Dialog Pattern Template
 * CRITICAL: Follow exact UWC Dialog API
 *
 * Key Requirements:
 * - Use `heading` attribute for title (NOT slot="header")
 * - Use `.show()` method to open (NOT ?open property)
 * - Use `.close()` method to close
 * - Use `slot="primaryAction"` for confirm button
 * - Use `slot="secondaryAction"` for cancel button
 * - Place content directly inside (NO slot="content")
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// TypeScript interfaces
interface ItemData {
  id: string;
  name: string;
}

interface DeleteConfirmedEvent {
  itemId: string;
}

@customElement("delete-confirmation-dialog")
export class DeleteConfirmationDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .warning-text {
      color: var(--uwc-color-error);
    }
  `;

  // Item to delete
  @property({ type: Object })
  item: ItemData | null = null;

  // Show the dialog
  public show(): void {
    const dialog = this.shadowRoot?.getElementById("deleteDialog") as any;
    if (dialog) {
      dialog.show(); // CORRECT: Use .show() method
    }
  }

  // Close the dialog
  private close(): void {
    const dialog = this.shadowRoot?.getElementById("deleteDialog") as any;
    if (dialog) {
      dialog.close(); // CORRECT: Use .close() method
    }
  }

  // Handle delete confirmation
  private handleConfirmDelete(): void {
    if (this.item) {
      this.dispatchEvent(
        new CustomEvent<DeleteConfirmedEvent>("delete-confirmed", {
          detail: { itemId: this.item.id },
          bubbles: true,
          composed: true,
        }),
      );
    }
    this.close();
  }

  // Handle cancel
  private handleCancel(): void {
    this.dispatchEvent(
      new CustomEvent("delete-cancelled", {
        bubbles: true,
        composed: true,
      }),
    );
    this.close();
  }

  render() {
    return html`
      <!-- CORRECT Dialog API -->
      <uwc-dialog id="deleteDialog" heading="Confirm Deletion">
        <!-- Content goes directly inside, NO slot="content" -->
        <p>Are you sure you want to delete "${this.item?.name}"?</p>
        <p class="warning-text">This action cannot be undone.</p>

        <!-- Use slot="secondaryAction" for cancel button -->
        <uwc-button
          label="Cancel"
          dialogAction="cancel"
          slot="secondaryAction"
          @click=${this.handleCancel}
        >
        </uwc-button>

        <!-- Use slot="primaryAction" for confirm button -->
        <uwc-button
          label="Delete"
          dialogAction="delete"
          slot="primaryAction"
          @click=${this.handleConfirmDelete}
        >
        </uwc-button>
      </uwc-dialog>
    `;
  }
}

/**
 * WRONG PATTERNS - Do NOT use:
 *
 * <uwc-dialog ?open="${this.isOpen}">  // Wrong: No ?open property
 *   <h2 slot="header">Title</h2>       // Wrong: Use heading attribute
 *   <div slot="content">Content</div>  // Wrong: No slot="content"
 *   <div slot="actions">               // Wrong: No slot="actions"
 *     <uwc-button>OK</uwc-button>
 *   </div>
 * </uwc-dialog>
 *
 * dialog.open();  // Wrong: Use .show() instead
 */

/**
 * Usage Example:
 *
 * // In parent component:
 * @state()
 * private itemToDelete: ItemData | null = null;
 *
 * private showDeleteDialog(item: ItemData) {
 *   this.itemToDelete = item;
 *   const dialog = this.shadowRoot?.querySelector('delete-confirmation-dialog');
 *   dialog?.show();
 * }
 *
 * private handleDeleteConfirmed(e: CustomEvent<DeleteConfirmedEvent>) {
 *   await this.deleteItem(e.detail.itemId);
 *   this.itemToDelete = null;
 * }
 *
 * render() {
 *   return html`
 *     <uwc-button @click=${() => this.showDeleteDialog(item)}>Delete</uwc-button>
 *
 *     <delete-confirmation-dialog
 *       .item=${this.itemToDelete}
 *       @delete-confirmed=${this.handleDeleteConfirmed}
 *     ></delete-confirmation-dialog>
 *   `;
 * }
 */
