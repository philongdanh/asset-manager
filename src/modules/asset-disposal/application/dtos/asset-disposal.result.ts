import { AssetDisposal } from '../../domain';
import { Asset } from '../../../asset/domain';
import { Organization } from '../../../organization/domain';
import { User } from '../../../user/domain';

export interface AssetDisposalResult {
  disposal: AssetDisposal;
  asset: Asset | null;
  organization: Organization | null;
  approvedByUser: User | null;
}
