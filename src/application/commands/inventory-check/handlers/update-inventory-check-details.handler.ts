import { Injectable, Inject } from '@nestjs/common';
import {
    INVENTORY_CHECK_REPOSITORY,
    type IInventoryCheckRepository,
} from 'src/domain/inventory-audit/inventory-check';
import { UpdateInventoryCheckDetailsCommand } from '../update-inventory-check-details.command';

@Injectable()
export class UpdateInventoryCheckDetailsHandler {
    constructor(
        @Inject(INVENTORY_CHECK_REPOSITORY)
        private readonly repository: IInventoryCheckRepository,
    ) { }

    async execute(cmd: UpdateInventoryCheckDetailsCommand): Promise<void> {
        await this.repository.updateCheckDetails(cmd.inventoryCheckId, cmd.details);
    }
}
