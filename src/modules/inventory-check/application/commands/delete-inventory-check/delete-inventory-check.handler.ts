import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteInventoryCheckCommand } from './delete-inventory-check.command';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
} from '../../../domain';

@CommandHandler(DeleteInventoryCheckCommand)
export class DeleteInventoryCheckHandler implements ICommandHandler<DeleteInventoryCheckCommand> {
  constructor(
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly inventoryCheckRepository: IInventoryCheckRepository,
  ) {}

  async execute(command: DeleteInventoryCheckCommand): Promise<void> {
    const exists = await this.inventoryCheckRepository.existsById(
      command.inventoryCheckId,
    );
    if (!exists) {
      throw new NotFoundException(
        `Inventory check with ID ${command.inventoryCheckId} not found`,
      );
    }

    await this.inventoryCheckRepository.delete(command.inventoryCheckId);
  }
}
