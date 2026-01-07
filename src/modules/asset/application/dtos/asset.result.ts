import { Asset } from '../../domain/entities/asset.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { AssetCategory } from 'src/modules/asset-category/domain/asset-category.entity';

export interface AssetResult {
  asset: Asset;
  organization: Organization | null;
  category: AssetCategory | null;
  createdByUser: User | null;
}
