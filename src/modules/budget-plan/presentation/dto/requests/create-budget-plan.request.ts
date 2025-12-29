import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';
import { BudgetType } from 'src/modules/budget-plan/domain';

export class CreateBudgetPlanRequest {
  @Expose({ name: 'organization_id' })
  @IsUUID('4')
  organizationId: string;

  @Expose({ name: 'department_id' })
  @IsUUID('4')
  departmentId: string;

  @Expose({ name: 'fiscal_year' })
  @IsNumber()
  @Type(() => Number)
  fiscalYear: number;

  @Expose({ name: 'budget_type' })
  @IsEnum(BudgetType)
  budgetType: BudgetType;

  @Expose({ name: 'allocated_amount' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  allocatedAmount: number;
}
