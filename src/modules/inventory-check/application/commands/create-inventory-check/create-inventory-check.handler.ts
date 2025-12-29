import { Injectable, Inject } from '@nestjs/common';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
    INVENTORY_CHECK_REPOSITORY,
    type IInventoryCheckRepository,
    InventoryCheck,
} from 'src/modules/inventory-check/domain';
import { CreateInventoryCheckCommand } from './create-inventory-check.command';

@Injectable()
export class CreateInventoryCheckHandler {
    constructor(
        @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
        @Inject(INVENTORY_CHECK_REPOSITORY)
        private readonly repository: IInventoryCheckRepository,
    ) { }

    async execute(cmd: CreateInventoryCheckCommand): Promise<InventoryCheck> {
        const id = this.idGenerator.generate();
        const builder = InventoryCheck.builder(
            id,
            cmd.organizationId,
            cmd.createdByUserId,
        );

        if (cmd.checkDate) builder.withCheckDate(cmd.checkDate);
        if (cmd.notes) builder.withNotes(cmd.notes);

        const check = builder.build();
        return await this.repository.save(check);
    }
}
