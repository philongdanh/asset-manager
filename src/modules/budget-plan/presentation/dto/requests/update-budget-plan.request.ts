import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';
import { BudgetStatus, BudgetType } from 'src/modules/budget-plan/domain';

export class UpdateBudgetPlanRequest {
    @Expose({ name: 'allocated_amount' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    allocatedAmount?: number;

    @Expose({ name: 'budget_type' })
    @IsOptional()
    @IsEnum(BudgetType)
    budgetType?: BudgetType;

    @Expose({ name: 'fiscal_year' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    fiscalYear?: number;

    @Expose({ name: 'status' })
    @IsOptional()
    @IsEnum(BudgetStatus)
    status?: BudgetStatus;
}
