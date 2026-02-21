/**
 * {Component Name}
 * {Description of functionality}
 *
 * @fires {event-name} - {When/why fired} - Detail: { {fields} }
 *
 * @example
 * ```html
 * <{component-name}
 *   property="value"
 *   @event-name=${handler}>
 * </{component-name}>
 * ```
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { dataContext, DataContext } from "../../contexts/data-context.js";

// TypeScript interfaces
interface ItemData {
  id: string;
  name: string;
  // Add more properties as needed
}

interface ItemSelectedEvent {
  itemId: string;
  timestamp: number;
}

@customElement("component-name")
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

    .header {
      color: var(--uwc-color-text-primary);
      font-size: var(--uwc-font-size-heading);
    }
  `;

  // DataContext consumption
  @consume({ context: dataContext, subscribe: true })
  @property({ attribute: false })
  data!: DataContext;

  // Public properties (@property)
  @property({ type: String })
  title = "";

  @property({ type: Array })
  items: ItemData[] = [];

  // Private state (@state)
  @state()
  private isLoading = false;

  @state()
  private selectedId?: string;

  // Lifecycle
  override async connectedCallback() {
    super.connectedCallback();
    // Refresh data from DataContext (uses 5-min cache)
    // await this.data.refreshEntities();
  }

  // Event handlers (private methods)
  private handleItemSelect(item: ItemData) {
    this.selectedId = item.id;
    this.dispatchEvent(
      new CustomEvent<ItemSelectedEvent>("item-selected", {
        detail: {
          itemId: item.id,
          timestamp: Date.now(),
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleAction() {
    this.dispatchEvent(
      new CustomEvent("action-triggered", {
        detail: {
          /* event data */
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Render method (UWC components only!)
  render() {
    if (this.isLoading) {
      return html`<uwc-linear-progress></uwc-linear-progress>`;
    }

    return html`
      <uwc-card>
        <h2 slot="header">${this.title}</h2>

        <div class="container">
          ${this.items.map(
            (item) => html`
              <uwc-button
                variant=${this.selectedId === item.id ? "filled" : "outlined"}
                label=${item.name}
                @click=${() => this.handleItemSelect(item)}
              >
              </uwc-button>
            `,
          )}
        </div>

        <div slot="footer">
          <uwc-button variant="filled" @click=${this.handleAction}>
            Action
          </uwc-button>
        </div>
      </uwc-card>
    `;
  }
}
