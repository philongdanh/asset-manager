import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
} from 'src/modules/inventory-check/domain';
import { UpdateInventoryCheckCommand } from './update-inventory-check.command';
import { InventoryCheckResult } from '../../dtos/inventory-check.result';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/modules/organization/domain';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/modules/user/domain';

@Injectable()
export class UpdateInventoryCheckHandler {
  constructor(
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly repository: IInventoryCheckRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(
    cmd: UpdateInventoryCheckCommand,
  ): Promise<InventoryCheckResult> {
    const check = await this.repository.findById(cmd.id);
    if (!check) {
      throw new UseCaseException(
        'Inventory check not found',
        'UpdateInventoryCheckHandler',
      );
    }

    check.updateInfo(cmd.name, cmd.checkDate);

    if (cmd.status === 'FINISHED' && check.status !== 'FINISHED') {
      check.finish();
    }

    const savedCheck = await this.repository.save(check);

    const [organization, checkerUser] = await Promise.all([
      this.organizationRepository.findById(savedCheck.organizationId),
      this.userRepository.findById(savedCheck.checkerUserId),
    ]);

    return {
      inventoryCheck: savedCheck,
      organization,
      checkerUser,
    };
  }
}
