import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';
import { BudgetStatus, BudgetType } from 'src/modules/budget-plan/domain';

export class GetBudgetPlansRequest {
    @Expose({ name: 'fiscal_year' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    fiscalYear?: number;

    @Expose({ name: 'department_id' })
    @IsOptional()
    @IsUUID('4')
    departmentId?: string;

    @Expose({ name: 'status' })
    @IsOptional()
    @IsEnum(BudgetStatus)
    status?: BudgetStatus;

    @Expose({ name: 'budget_type' })
    @IsOptional()
    @IsEnum(BudgetType)
    budgetType?: BudgetType;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    offset?: number;
}
