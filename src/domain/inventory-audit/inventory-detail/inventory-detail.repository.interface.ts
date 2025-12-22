import { InventoryDetail } from './inventory-detail.entity';

export const INVENTORY_DETAIL_REPOSITORY = Symbol(
  'INVENTORY_DETAIL_REPOSITORY',
);

export interface IInventoryDetailRepository {
  // --- Query Methods ---

  findById(id: string): Promise<InventoryDetail | null>;

  findByCheckId(inventoryCheckId: string): Promise<InventoryDetail[]>;

  findByCheckAndAsset(
    inventoryCheckId: string,
    assetId: string,
  ): Promise<InventoryDetail | null>;

  findMissingAssets(inventoryCheckId: string): Promise<InventoryDetail[]>;

  findStatusDiscrepancies(inventoryCheckId: string): Promise<InventoryDetail[]>;

  // --- Persistence Methods ---

  save(detail: InventoryDetail): Promise<InventoryDetail>;

  saveMany(details: InventoryDetail[]): Promise<void>;

  delete(id: string): Promise<void>;

  createInitialDetails(
    inventoryCheckId: string,
    assetIds: string[],
  ): Promise<void>;
}
