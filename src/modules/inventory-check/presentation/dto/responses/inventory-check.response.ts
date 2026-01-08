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
  assetCode: string;
  assetName: string;
  purchasePrice: number;
  originalCost: number;
  currentValue: number;
  status: string;
  model: string | null;
  serialNumber: string | null;
  manufacturer: string | null;
  location: string | null;
  condition: string | null;
  imageUrl: string | null;
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
      assetCode: a.assetCode,
      assetName: a.assetName,
      purchasePrice: a.purchasePrice,
      originalCost: a.originalCost,
      currentValue: a.currentValue,
      status: a.status,
      model: a.model,
      serialNumber: a.serialNumber,
      manufacturer: a.manufacturer,
      location: a.location,
      condition: a.condition,
      imageUrl: a.imageUrl,
    }));
  }
}
