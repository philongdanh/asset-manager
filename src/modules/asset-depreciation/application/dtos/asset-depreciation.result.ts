import { AssetDepreciation } from '../../domain';
import { Asset } from '../../../asset/domain';
import { Organization } from '../../../organization/domain';

export interface AssetDepreciationResult {
    depreciation: AssetDepreciation;
    asset: Asset | null;
    organization: Organization | null;
}
