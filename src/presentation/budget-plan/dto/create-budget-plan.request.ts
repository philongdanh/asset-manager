import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { BudgetType } from 'src/domain/finance-accounting/budget-plan';

export class CreateBudgetPlanRequest {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsUUID()
  departmentId: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  fiscalYear: number;

  @IsNotEmpty()
  @IsEnum(BudgetType)
  budgetType: BudgetType;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  allocatedAmount: number;
}
