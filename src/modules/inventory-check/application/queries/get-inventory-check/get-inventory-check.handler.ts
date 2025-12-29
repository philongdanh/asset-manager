import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
  InventoryCheck,
} from 'src/modules/inventory-check/domain';
import { GetInventoryCheckQuery } from './get-inventory-check.query';

@Injectable()
export class GetInventoryCheckHandler {
  constructor(
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly repository: IInventoryCheckRepository,
  ) {}

  async execute(query: GetInventoryCheckQuery): Promise<InventoryCheck> {
    const check = await this.repository.findById(query.id);
    if (!check) {
      throw new UseCaseException(
        'Inventory check not found',
        'GetInventoryCheckQuery',
      );
    }
    return check;
  }
}
