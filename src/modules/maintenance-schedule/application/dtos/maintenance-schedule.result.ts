import { MaintenanceSchedule } from '../../domain';
import { Asset } from '../../../asset/domain';
import { Organization } from '../../../organization/domain';
import { User } from '../../../user/domain';

export interface MaintenanceScheduleResult {
    maintenance: MaintenanceSchedule;
    asset: Asset | null;
    organization: Organization | null;
    performedByUser: User | null;
}
