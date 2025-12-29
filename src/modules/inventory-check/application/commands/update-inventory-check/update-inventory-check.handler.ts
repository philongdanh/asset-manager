import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
  InventoryCheck,
} from 'src/modules/inventory-check/domain';
import { UpdateInventoryCheckCommand } from './update-inventory-check.command';

@Injectable()
export class UpdateInventoryCheckHandler {
  constructor(
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly repository: IInventoryCheckRepository,
  ) {}

  async execute(cmd: UpdateInventoryCheckCommand): Promise<InventoryCheck> {
    const check = await this.repository.findById(cmd.id);
    if (!check) {
      throw new UseCaseException(
        'Inventory check not found',
        'UpdateInventoryCheckHandler',
      );
    }

    check.updateInfo(cmd.notes, cmd.checkDate);

    if (cmd.status === 'FINISHED' && check.status !== 'FINISHED') {
      check.finish();
    }

    return await this.repository.save(check);
  }
}
