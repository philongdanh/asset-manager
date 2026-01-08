import { AssetTransfer } from '../../domain';
import { Asset } from '../../../asset/domain';
import { Organization } from '../../../organization/domain';
import { Department } from '../../../department/domain';
import { User } from '../../../user/domain';

export interface AssetTransferResult {
  transfer: AssetTransfer;
  asset: Asset | null;
  organization: Organization | null;
  fromDepartment: Department | null;
  toDepartment: Department | null;
  fromUser: User | null;
  toUser: User | null;
  approvedByUser: User | null;
}
