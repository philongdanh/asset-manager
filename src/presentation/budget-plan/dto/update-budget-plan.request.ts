import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import {
  BudgetStatus,
  BudgetType,
} from 'src/domain/finance-accounting/budget-plan';

export class UpdateBudgetPlanRequest {
  @IsOptional()
  @IsInt()
  @IsPositive()
  fiscalYear?: number;

  @IsOptional()
  @IsEnum(BudgetType)
  budgetType?: BudgetType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  allocatedAmount?: number;

  @IsOptional()
  @IsEnum(BudgetStatus)
  status?: BudgetStatus;
}
