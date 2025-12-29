import { Injectable, Inject } from '@nestjs/common';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
  InventoryCheck,
} from 'src/domain/inventory-audit/inventory-check';
import { FinishInventoryCheckCommand } from '../finish-inventory-check.command';
import { UseCaseException } from 'src/application/core/exceptions';

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
