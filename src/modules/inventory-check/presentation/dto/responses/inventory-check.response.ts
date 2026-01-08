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

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(result: InventoryCheckResult) {
    const { inventoryCheck, organization, checkerUser } = result;

    this.id = inventoryCheck.id;
    this.name = inventoryCheck.inventoryName;
    this.checkDate = inventoryCheck.checkDate;
    this.status = inventoryCheck.status;
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
  }
}
