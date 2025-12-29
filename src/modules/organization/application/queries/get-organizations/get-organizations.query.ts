import { OrganizationStatus } from '../../../domain';

export class GetOrganizationsQuery {
    constructor(
        public readonly status?: OrganizationStatus,
        public readonly includeDeleted?: boolean,
    ) { }
}
