import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
  InventoryCheck,
} from 'src/modules/inventory-check/domain';
import { FinishInventoryCheckCommand } from './finish-inventory-check.command';

@Injectable()
export class FinishInventoryCheckHandler {
  constructor(
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly repository: IInventoryCheckRepository,
  ) {}

  async execute(cmd: FinishInventoryCheckCommand): Promise<InventoryCheck> {
    const check = await this.repository.findById(cmd.id);
    if (!check) {
      throw new UseCaseException(
        'Inventory check not found',
        'FinishInventoryCheckHandler',
      );
    }

    check.finish();
    return await this.repository.save(check);
  }
}
