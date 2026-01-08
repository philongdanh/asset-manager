import { InventoryCheck } from './inventory-check.entity';

export const INVENTORY_CHECK_REPOSITORY = Symbol('INVENTORY_CHECK_REPOSITORY');

export interface IInventoryCheckRepository {
  // --- Query Methods ---

  findById(id: string): Promise<InventoryCheck | null>;

  findAll(
    organizationId: string,
    options?: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
      assetIds?: string[];
    },
  ): Promise<{ data: InventoryCheck[]; total: number }>;

  findByDepartment(departmentId: string): Promise<InventoryCheck[]>;

  findActiveCheck(organizationId: string): Promise<InventoryCheck | null>;

  // --- Validation Methods ---

  hasPendingCheck(departmentId: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;

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
