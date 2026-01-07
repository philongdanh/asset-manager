import { Exclude, Expose } from 'class-transformer';
import {
  Asset,
  AssetCondition,
  AssetStatus,
} from '../../../domain/entities/asset.entity';
import { AssetResult } from '../../../application/dtos/asset.result';

// Inline types for clean serialization
interface OrganizationInfo {
  id: string;
  name: string;
}

interface CategoryInfo {
  id: string;
  code: string;
  category_name: string;
  parent_id: string | null;
}

interface CreatedByUserInfo {
  id: string;
  username: string;
  email: string;
}

@Exclude()
export class AssetResponse {
  @Expose()
  id: string;

  @Expose()
  organization: OrganizationInfo | null;

  @Expose({ name: 'asset_code' })
  assetCode: string;

  @Expose({ name: 'asset_name' })
  assetName: string;

  @Expose()
  category: CategoryInfo | null;

  @Expose({ name: 'created_by_user' })
  createdByUser: CreatedByUserInfo | null;

  @Expose({ name: 'purchase_price' })
  purchasePrice: number;

  @Expose({ name: 'original_cost' })
  originalCost: number;

  @Expose({ name: 'current_value' })
  currentValue: number;

  @Expose()
  status: AssetStatus;

  @Expose({ name: 'current_department_id' })
  currentDepartmentId: string | null;

  @Expose({ name: 'current_user_id' })
  currentUserId: string | null;

  @Expose()
  model: string | null;

  @Expose({ name: 'serial_number' })
  serialNumber: string | null;

  @Expose()
  manufacturer: string | null;

  @Expose({ name: 'purchase_date' })
  purchaseDate: Date | null;

  @Expose({ name: 'warranty_expiry_date' })
  warrantyExpiryDate: Date | null;

  @Expose()
  location: string | null;

  @Expose()
  specifications: string | null;

  @Expose()
  condition: AssetCondition | null;

  @Expose()
  imageUrl: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(result: AssetResult | Asset) {
    const asset = 'asset' in result ? result.asset : result;
    this.id = asset.id;
    this.assetCode = asset.assetCode;
    this.assetName = asset.assetName;
    this.purchasePrice = asset.purchasePrice;
    this.originalCost = asset.originalCost;
    this.currentValue = asset.currentValue;
    this.status = asset.status;
    this.currentDepartmentId = asset.currentDepartmentId;
    this.currentUserId = asset.currentUserId;
    this.model = asset.model;
    this.serialNumber = asset.serialNumber;
    this.manufacturer = asset.manufacturer;
    this.purchaseDate = asset.purchaseDate;
    this.warrantyExpiryDate = asset.warrantyExpiryDate;
    this.location = asset.location;
    this.specifications = asset.specifications;
    this.condition = asset.condition;
    this.imageUrl = asset.imageUrl;
    this.createdAt = asset.createdAt!;
    this.updatedAt = asset.updatedAt!;

    if ('asset' in result) {
      this.organization = result.organization
        ? { id: result.organization.id, name: result.organization.name }
        : null;
      this.category = result.category
        ? {
          id: result.category.id,
          code: result.category.code,
          category_name: result.category.categoryName,
          parent_id: result.category.parentId,
        }
        : null;
      this.createdByUser = result.createdByUser
        ? {
          id: result.createdByUser.id,
          username: result.createdByUser.username,
          email: result.createdByUser.email,
        }
        : null;
    } else {
      this.organization = null;
      this.category = null;
      this.createdByUser = null;
    }
  }
}
