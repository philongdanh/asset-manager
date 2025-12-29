import { Injectable, Inject } from '@nestjs/common';
import {
    INVENTORY_CHECK_REPOSITORY,
    type IInventoryCheckRepository,
    InventoryCheck,
} from 'src/modules/inventory-check/domain';
import { GetInventoryChecksQuery } from './get-inventory-checks.query';

@Injectable()
export class GetInventoryChecksHandler {
    constructor(
        @Inject(INVENTORY_CHECK_REPOSITORY)
        private readonly repository: IInventoryCheckRepository,
    ) { }

    async execute(
        query: GetInventoryChecksQuery,
    ): Promise<{ data: InventoryCheck[]; total: number }> {
        return await this.repository.findAll(query.organizationId, query.options);
    }
}
