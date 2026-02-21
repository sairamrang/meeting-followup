# State Management Patterns

## Overview

Frontend state management uses:
1. **Frontend API Service** - Type-safe API client using openapi-fetch
2. **DataContext** - Centralized state with Lit Context API

**CRITICAL:** NO localStorage - all data flows through backend API.

---

## Pattern: Frontend API Service

**File:** `frontend/src/services/{feature}-service.ts`

**Purpose:** Type-safe API client using openapi-fetch

**Key Rules:**
- Use `openapi-fetch` for API calls
- NO localStorage - always call backend
- Handle errors with `handleApiError()`
- Extract data from `successResponse` wrapper
- Use const userId (hardcoded for now)

**Template:** [../templates/frontend-service.template.ts](../templates/frontend-service.template.ts)

### Service Structure

```typescript
import type {
  EntityType,
  CreateRequest,
  UpdateRequest,
} from "../../../shared/dist/index.js";
import { api, handleApiError } from "./api-client.js";

export class FeatureService {
  private readonly userId = "user-123";

  async getAll(): Promise<EntityType[]> {
    const { data, error } = await api.GET("/api/v1/features", {
      params: {
        query: { userId: this.userId },
      },
    });

    if (error) {
      throw handleApiError(error);
    }

    return (data as { data: EntityType[] }).data;
  }

  async getById(id: string): Promise<EntityType> {
    const { data, error } = await api.GET("/api/v1/features/{id}", {
      params: {
        path: { id },
        query: { userId: this.userId },
      },
    });

    if (error) {
      throw handleApiError(error);
    }

    return (data as { data: EntityType }).data;
  }

  async create(request: Omit<CreateRequest, "userId">): Promise<EntityType> {
    const { data, error } = await api.POST("/api/v1/features", {
      body: {
        ...request,
        userId: this.userId,
      } as CreateRequest,
    });

    if (error) {
      throw handleApiError(error);
    }

    return (data as { data: EntityType }).data;
  }

  async update(id: string, request: UpdateRequest): Promise<EntityType> {
    const { data, error } = await api.PUT("/api/v1/features/{id}", {
      params: {
        path: { id },
        query: { userId: this.userId },
      },
      body: request,
    });

    if (error) {
      throw handleApiError(error);
    }

    return (data as { data: EntityType }).data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await api.DELETE("/api/v1/features/{id}", {
      params: {
        path: { id },
        query: { userId: this.userId },
      },
    });

    if (error) {
      throw handleApiError(error);
    }
  }
}

export const featureService = new FeatureService();
```

---

## Pattern: DataContext Integration

Adding a new entity to DataContext requires updates to both types and implementation.

**Template:** [../templates/data-context-additions.template.ts](../templates/data-context-additions.template.ts)

### Step 1: Update DataContext Types

**File:** `frontend/src/contexts/data-context.types.ts`

Add new entity to all state interfaces:

```typescript
export interface LoadingState {
  accounts: boolean;
  transactions: boolean;
  recurringPayments: boolean;
  newFeature: boolean; // ADD THIS
}

export interface ErrorState {
  accounts: string | null;
  transactions: string | null;
  recurringPayments: string | null;
  newFeature: string | null; // ADD THIS
}

export interface TimestampState {
  accounts: number;
  transactions: number;
  recurringPayments: number;
  newFeature: number; // ADD THIS
}

export interface DataState {
  accounts: Account[];
  transactions: Transaction[];
  recurringPayments: RecurringPayment[];
  newFeature: NewFeature[]; // ADD THIS
  // ... rest
}

export interface DataContext extends DataState {
  // ... existing methods
  refreshNewFeature(force?: boolean): Promise<void>; // ADD THIS
  getNewFeatureById(id: string): NewFeature | null; // ADD THIS
}

export interface DataServices {
  account?: AccountService;
  transaction?: TransactionService;
  recurringPayment?: RecurringPaymentService;
  newFeature?: NewFeatureService; // ADD THIS
}
```

### Step 2: Update DataContext Implementation

**File:** `frontend/src/contexts/data-context.ts`

```typescript
// 1. Import the service
import { newFeatureService } from '../services/new-feature-service.js';

// 2. Add to DataProvider constructor services
this.services = {
  account: accountService,
  transaction: transactionService,
  recurringPayment: recurringPaymentService,
  newFeature: newFeatureService, // ADD THIS
};

// 3. Initialize state
this.loading = {
  accounts: false,
  transactions: false,
  recurringPayments: false,
  newFeature: false, // ADD THIS
};

this.error = {
  accounts: null,
  transactions: null,
  recurringPayments: null,
  newFeature: null, // ADD THIS
};

this.timestamps = {
  accounts: 0,
  transactions: 0,
  recurringPayments: 0,
  newFeature: 0, // ADD THIS
};

// 4. Initialize data
this.data = {
  accounts: [],
  transactions: [],
  recurringPayments: [],
  newFeature: [], // ADD THIS
};

// 5. Add refresh method
private async refreshNewFeature(force = false): Promise<void> {
  this.performanceMonitor.trackApiCallAttempt();

  if (!force && !this.isStale('newFeature')) {
    this.performanceMonitor.trackCacheHit();
    return;
  }

  this.performanceMonitor.trackCacheMiss();

  return this.executeRequest('newFeature', async () => {
    const items = await this.services.newFeature!.getAll();
    this.updateEntityData('newFeature', items);
  });
}

// 6. Add getter method
public getNewFeatureById(id: string): NewFeature | null {
  return this.data.newFeature.find((item) => item.id === id) || null;
}

// 7. Add to refreshAll()
async refreshAll(): Promise<void> {
  await Promise.all([
    this.refreshAccounts(),
    this.refreshTransactions(),
    this.refreshRecurringPayments(),
    this.refreshNewFeature(), // ADD THIS
  ]);
}

// 8. Add to clearAllData()
clearAllData(): void {
  this.updateEntityData('accounts', []);
  this.updateEntityData('transactions', []);
  this.updateEntityData('recurringPayments', []);
  this.updateEntityData('newFeature', []); // ADD THIS
}
```

---

## DataContext Features

### Caching
- 5-minute TTL per entity type
- Automatic staleness check via `isStale(entityKey)`
- Force refresh with `force = true` parameter

### Request Deduplication
- Prevents duplicate API calls for same entity
- Pending requests tracked per entity type

### Loading States
- Per-entity loading state in `this.loading`
- Components can show spinners for specific data

### Error Handling
- Per-entity error state in `this.error`
- Errors automatically cleared on successful refresh

### Performance Monitoring
- Built-in `PerformanceMonitor` instance
- Tracks API calls, cache hits/misses
- Use for debugging and optimization

---

## Consuming DataContext in Components

Components use `@consume` decorator to access DataContext:

```typescript
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { dataContext, DataContext } from "../../contexts/data-context.js";

@customElement("feature-list")
export class FeatureList extends LitElement {
  // Consume DataContext
  @consume({ context: dataContext, subscribe: true })
  @property({ attribute: false })
  data!: DataContext;

  override async connectedCallback() {
    super.connectedCallback();
    // Refresh data (uses 5-min cache)
    await this.data.refreshNewFeature();
  }

  override render() {
    // Access cached data
    const items = this.data.newFeature;
    const isLoading = this.data.loading.newFeature;
    const error = this.data.error.newFeature;

    if (isLoading) {
      return html`<uwc-linear-progress></uwc-linear-progress>`;
    }

    if (error) {
      return html`<uwc-error-summary>${error}</uwc-error-summary>`;
    }

    return html`
      <div class="list">
        ${items.map((item) => html`<item-card .item=${item}></item-card>`)}
      </div>
    `;
  }
}
```
