import { Expose } from 'class-transformer';

export class InventoryDetailResponse {
  @Expose()
  id: string;

  @Expose({ name: 'inventory_check_id' })
  inventoryCheckId: string;

  @Expose({ name: 'asset_id' })
  assetId: string;

  @Expose({ name: 'expected_location' })
  expectedLocation: string | null;

  @Expose({ name: 'actual_location' })
  actualLocation: string | null;

  @Expose({ name: 'expected_status' })
  expectedStatus: string;

  @Expose({ name: 'actual_status' })
  actualStatus: string | null;

  @Expose({ name: 'is_match' })
  isMatch: boolean;

  @Expose()
  notes: string | null;
}
