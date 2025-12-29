import { Injectable, Inject } from '@nestjs/common';
import {
    ORGANIZATION_REPOSITORY,
    type IOrganizationRepository,
    Organization,
} from '../../../domain';
import { GetOrganizationsQuery } from './get-organizations.query';

@Injectable()
export class GetOrganizationsHandler {
    constructor(
        @Inject(ORGANIZATION_REPOSITORY)
        private readonly orgRepo: IOrganizationRepository,
    ) { }

    async execute(query: GetOrganizationsQuery): Promise<Organization[]> {
        return await this.orgRepo.find(query.status, query.includeDeleted);
    }
}
