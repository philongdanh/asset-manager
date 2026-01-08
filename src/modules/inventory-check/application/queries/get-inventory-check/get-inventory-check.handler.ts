import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
} from 'src/modules/inventory-check/domain';
import { GetInventoryCheckQuery } from './get-inventory-check.query';
import { InventoryCheckResult } from '../../dtos/inventory-check.result';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/modules/organization/domain';
import { USER_REPOSITORY, type IUserRepository } from 'src/modules/user/domain';

@Injectable()
export class GetInventoryCheckHandler {
  constructor(
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly repository: IInventoryCheckRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetInventoryCheckQuery): Promise<InventoryCheckResult> {
    const inventoryCheck = await this.repository.findById(query.id);
    if (!inventoryCheck) {
      throw new UseCaseException(
        'Inventory check not found',
        'GetInventoryCheckQuery',
      );
    }

    const [organization, checkerUser] = await Promise.all([
      this.organizationRepository.findById(inventoryCheck.organizationId),
      this.userRepository.findById(inventoryCheck.checkerUserId),
    ]);

    return {
      inventoryCheck,
      organization,
      checkerUser,
    };
  }
}
