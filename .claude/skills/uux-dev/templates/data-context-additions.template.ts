/**
 * DataContext Additions Template
 *
 * When adding a new entity to DataContext, update these files:
 * 1. frontend/src/contexts/data-context.types.ts
 * 2. frontend/src/contexts/data-context.ts
 *
 * Replace {entity}, {Entity}, {entities} with actual names
 */

// ============================================
// FILE: data-context.types.ts ADDITIONS
// ============================================

// Add to LoadingState interface:
export interface LoadingState {
  // ... existing
  entities: boolean; // ADD THIS
}

// Add to ErrorState interface:
export interface ErrorState {
  // ... existing
  entities: string | null; // ADD THIS
}

// Add to TimestampState interface:
export interface TimestampState {
  // ... existing
  entities: number; // ADD THIS
}

// Add to DataState interface:
export interface DataState {
  // ... existing
  entities: Entity[]; // ADD THIS
}

// Add to DataContext interface:
export interface DataContext extends DataState {
  // ... existing methods
  refreshEntities(force?: boolean): Promise<void>; // ADD THIS
  getEntityById(id: string): Entity | null; // ADD THIS
}

// Add to DataServices interface:
export interface DataServices {
  // ... existing
  entity?: EntityService; // ADD THIS
}

// ============================================
// FILE: data-context.ts ADDITIONS
// ============================================

// 1. Import the service
import { entityService } from "../services/entity-service.js";

// 2. Add to DataProvider constructor services
// this.services = {
//   ...existing,
//   entity: entityService, // ADD THIS
// };

// 3. Initialize loading state
// this.loading = {
//   ...existing,
//   entities: false, // ADD THIS
// };

// 4. Initialize error state
// this.error = {
//   ...existing,
//   entities: null, // ADD THIS
// };

// 5. Initialize timestamps
// this.timestamps = {
//   ...existing,
//   entities: 0, // ADD THIS
// };

// 6. Initialize data
// this.data = {
//   ...existing,
//   entities: [], // ADD THIS
// };

// 7. Add refresh method (add to class):
/*
private async refreshEntities(force = false): Promise<void> {
  this.performanceMonitor.trackApiCallAttempt();

  if (!force && !this.isStale('entities')) {
    this.performanceMonitor.trackCacheHit();
    return;
  }

  this.performanceMonitor.trackCacheMiss();

  return this.executeRequest('entities', async () => {
    const items = await this.services.entity!.getAll();
    this.updateEntityData('entities', items);
  });
}
*/

// 8. Add getter method (add to class):
/*
public getEntityById(id: string): Entity | null {
  return this.data.entities.find((item) => item.id === id) || null;
}
*/

// 9. Add to refreshAll():
/*
async refreshAll(): Promise<void> {
  await Promise.all([
    // ...existing
    this.refreshEntities(), // ADD THIS
  ]);
}
*/

// 10. Add to clearAllData():
/*
clearAllData(): void {
  // ...existing
  this.updateEntityData('entities', []); // ADD THIS
}
*/
