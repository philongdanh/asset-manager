import { Injectable, Inject } from '@nestjs/common';
import {
  INVENTORY_DETAIL_REPOSITORY,
  type IInventoryDetailRepository,
  InventoryDetail,
} from 'src/domain/inventory-audit/inventory-detail';
import { GetInventoryCheckDetailsQuery } from '../get-inventory-check-details.query';

@Injectable()
export class GetInventoryCheckDetailsHandler {
  constructor(
    @Inject(INVENTORY_DETAIL_REPOSITORY)
    private readonly repository: IInventoryDetailRepository,
  ) {}

  async execute(
    query: GetInventoryCheckDetailsQuery,
  ): Promise<InventoryDetail[]> {
    return await this.repository.findByCheckId(query.inventoryCheckId);
  }
}
