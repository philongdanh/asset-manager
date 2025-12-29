import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetStatus, BudgetType } from 'src/domain/finance-accounting/budget-plan';

export class GetBudgetPlansRequest {
    @IsOptional()
    @IsUUID()
    departmentId?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    fiscalYear?: number;

    @IsOptional()
    @IsEnum(BudgetStatus)
    status?: BudgetStatus;

    @IsOptional()
    @IsEnum(BudgetType)
    budgetType?: BudgetType;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number;
}
