import { InventoryCheck } from './inventory-check.entity';

export const INVENTORY_CHECK_REPOSITORY = Symbol('INVENTORY_CHECK_REPOSITORY');

export interface IInventoryCheckRepository {
  // --- Query Methods ---

  findById(id: string): Promise<InventoryCheck | null>;

  findAll(
    organizationId: string,
    options?: {
      status?: string; // e.g., 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: InventoryCheck[]; total: number }>;

  findByDepartment(departmentId: string): Promise<InventoryCheck[]>;

  findActiveCheck(organizationId: string): Promise<InventoryCheck | null>;

  // --- Validation Methods ---

  hasPendingCheck(departmentId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(inventoryCheck: InventoryCheck): Promise<InventoryCheck>;

  delete(id: string): Promise<void>;

  updateCheckDetails(
    inventoryCheckId: string,
    details: Array<{
      assetId: string;
      isFound: boolean;
      actualStatus: string;
      notes?: string;
    }>,
  ): Promise<void>;
}
