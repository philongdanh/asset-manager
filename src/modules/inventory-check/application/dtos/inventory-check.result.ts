import { InventoryCheck } from '../../domain/inventory-check.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { Asset } from 'src/modules/asset/domain';

export interface InventoryCheckResult {
  inventoryCheck: InventoryCheck;
  organization: Organization | null;
  checkerUser: User | null;
  assets?: Asset[];
}
