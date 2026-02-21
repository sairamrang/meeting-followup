/**
 * {Feature} Page
 * Container component with data loading, error handling, and retry
 *
 * @example
 * ```html
 * <feature-page></feature-page>
 * ```
 */

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { dataContext, DataContext } from "../../contexts/data-context.js";

// TypeScript interfaces
interface PageData {
  items: any[];
  summary: {
    total: number;
    active: number;
  };
}

@customElement("feature-page")
export class FeaturePage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: var(--uwc-spacing-3);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--uwc-spacing-3);
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--uwc-spacing-2);
      padding: var(--uwc-spacing-4);
    }
  `;

  // DataContext consumption
  @consume({ context: dataContext, subscribe: true })
  @state()
  data!: DataContext;

  // Local state
  @state()
  private pageData: PageData | null = null;

  @state()
  private isLoading = true;

  @state()
  private error: string | null = null;

  // Lifecycle
  override async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  // Data loading
  private async loadData() {
    this.isLoading = true;
    this.error = null;

    try {
      // Use DataContext for data fetching
      await this.data.refreshEntities();

      // Process data if needed
      this.pageData = {
        items: this.data.entities,
        summary: {
          total: this.data.entities.length,
          active: this.data.entities.filter((e) => e.status === "active").length,
        },
      };
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load data";
    } finally {
      this.isLoading = false;
    }
  }

  // Render loading state
  private renderLoading() {
    return html`
      <uwc-card>
        <uwc-linear-progress></uwc-linear-progress>
        <p>Loading...</p>
      </uwc-card>
    `;
  }

  // Render error state
  private renderError() {
    return html`
      <uwc-error-summary>
        <div class="error-container">
          <p>${this.error}</p>
          <uwc-button variant="outlined" @click=${this.loadData}>
            Retry
          </uwc-button>
        </div>
      </uwc-error-summary>
    `;
  }

  // Render content
  private renderContent() {
    if (!this.pageData) return null;

    return html`
      <div class="content">
        <uwc-card>
          <h1 slot="header">Feature Dashboard</h1>

          <div>
            <p>Total items: ${this.pageData.summary.total}</p>
            <p>Active items: ${this.pageData.summary.active}</p>
          </div>
        </uwc-card>

        <uwc-card>
          <h2 slot="header">Items</h2>

          ${this.pageData.items.length === 0
            ? html`<p>No items found</p>`
            : html`
                <uwc-list>
                  ${this.pageData.items.map(
                    (item) => html`
                      <uwc-list-item>${item.name}</uwc-list-item>
                    `,
                  )}
                </uwc-list>
              `}
        </uwc-card>
      </div>
    `;
  }

  render() {
    if (this.isLoading) {
      return this.renderLoading();
    }

    if (this.error) {
      return this.renderError();
    }

    return this.renderContent();
  }
}
