import { InventoryCheck } from '../../domain/inventory-check.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { User } from 'src/modules/user/domain/entities/user.entity';

export interface InventoryCheckResult {
    inventoryCheck: InventoryCheck;
    organization: Organization | null;
    checkerUser: User | null;
}
