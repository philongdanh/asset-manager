import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBudgetPlanCommand } from './delete-budget-plan.command';
import {
  BUDGET_PLAN_REPOSITORY,
  type IBudgetPlanRepository,
} from '../../../domain';

@CommandHandler(DeleteBudgetPlanCommand)
export class DeleteBudgetPlanHandler implements ICommandHandler<DeleteBudgetPlanCommand> {
  constructor(
    @Inject(BUDGET_PLAN_REPOSITORY)
    private readonly budgetPlanRepository: IBudgetPlanRepository,
  ) {}

  async execute(command: DeleteBudgetPlanCommand): Promise<void> {
    const exists = await this.budgetPlanRepository.existsById(command.planId);
    if (!exists) {
      throw new NotFoundException(
        `Budget plan with ID ${command.planId} not found`,
      );
    }

    await this.budgetPlanRepository.delete(command.planId);
  }
}
