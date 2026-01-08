import { Exclude, Expose } from 'class-transformer';
import type { InventoryCheckResult } from '../../../application/dtos/inventory-check.result';

// Inline types for clean serialization
interface OrganizationInfo {
  id: string;
  name: string;
}

interface CheckerUserInfo {
  id: string;
  username: string;
  email: string;
}

interface AssetInfo {
  id: string;
  asset_code: string;
  asset_name: string;
  purchase_price: number;
  original_cost: number;
  current_value: number;
  status: string;
  model: string | null;
  serial_number: string | null;
  manufacturer: string | null;
  location: string | null;
  condition: string | null;
  image_url: string | null;
}

@Exclude()
export class InventoryCheckResponse {
  @Expose()
  id: string;

  @Expose()
  organization: OrganizationInfo | null;

  @Expose()
  name: string;

  @Expose({ name: 'check_date' })
  checkDate: Date;

  @Expose({ name: 'checker_user' })
  checkerUser: CheckerUserInfo | null;

  @Expose()
  status: string;

  @Expose()
  notes: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  assets: AssetInfo[];

  constructor(result: InventoryCheckResult) {
    const { inventoryCheck, organization, checkerUser, assets } = result;

    this.id = inventoryCheck.id;
    this.name = inventoryCheck.inventoryName;
    this.checkDate = inventoryCheck.checkDate;
    this.status = inventoryCheck.status;
    this.notes = inventoryCheck.notes ?? null;
    this.createdAt = inventoryCheck.createdAt!;
    this.updatedAt = inventoryCheck.updatedAt!;

    this.organization = organization
      ? { id: organization.id, name: organization.name }
      : null;
    this.checkerUser = checkerUser
      ? {
          id: checkerUser.id,
          username: checkerUser.username,
          email: checkerUser.email,
        }
      : null;

    this.assets = (assets || []).map((a) => ({
      id: a.id,
      asset_code: a.assetCode,
      asset_name: a.assetName,
      purchase_price: a.purchasePrice,
      original_cost: a.originalCost,
      current_value: a.currentValue,
      status: a.status,
      model: a.model,
      serial_number: a.serialNumber,
      manufacturer: a.manufacturer,
      location: a.location,
      condition: a.condition,
      image_url: a.imageUrl,
    }));
  }
}
