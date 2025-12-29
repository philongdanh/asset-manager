import { Expose } from 'class-transformer';

export class InventoryDetailResponse {
  @Expose()
  id: string;

  @Expose()
  inventory_check_id: string;

  @Expose()
  asset_id: string;

  @Expose()
  expected_location: string | null;

  @Expose()
  actual_location: string | null;

  @Expose()
  expected_status: string;

  @Expose()
  actual_status: string | null;

  @Expose()
  is_match: boolean;

  @Expose()
  notes: string | null;
}
