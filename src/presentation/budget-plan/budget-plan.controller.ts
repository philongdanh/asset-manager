import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CreateBudgetPlanCommand, UpdateBudgetPlanCommand } from 'src/application/commands';
import { CreateBudgetPlanHandler, UpdateBudgetPlanHandler } from 'src/application/commands/handlers';
import {
    GetBudgetPlanDetailsQuery,
    GetBudgetPlansQuery,
} from 'src/application/queries';
import {
    GetBudgetPlanDetailsHandler,
    GetBudgetPlansHandler,
} from 'src/application/queries/handlers';
import { Permissions } from 'src/modules/auth/presentation';
import {
    BudgetPlanResponse,
    CreateBudgetPlanRequest,
    GetBudgetPlansRequest,
    UpdateBudgetPlanRequest,
} from './dto';
import { BudgetPlan } from 'src/domain/finance-accounting/budget-plan';

@Controller('budget-plans')
export class BudgetPlanController {
    constructor(
        private readonly createHandler: CreateBudgetPlanHandler,
        private readonly updateHandler: UpdateBudgetPlanHandler,
        private readonly getListHandler: GetBudgetPlansHandler,
        private readonly getDetailsHandler: GetBudgetPlanDetailsHandler,
    ) { }

    @HttpCode(HttpStatus.CREATED)
    @Permissions('BUDGET_CREATE')
    @Post()
    async create(
        @Body() dto: CreateBudgetPlanRequest,
    ): Promise<BudgetPlanResponse> {
        const cmd = new CreateBudgetPlanCommand(
            dto.organizationId,
            dto.departmentId,
            dto.fiscalYear,
            dto.budgetType,
            dto.allocatedAmount,
        );
        const result = await this.createHandler.execute(cmd);
        return this.toResponse(result);
    }

    @Permissions('BUDGET_UPDATE')
    @Patch(':id')
    async update(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() dto: UpdateBudgetPlanRequest,
    ): Promise<BudgetPlanResponse> {
        // We need to fetch existing plan to know values if not provided?
        // Command expects all fields? Or optional?
        // UpdateBudgetPlanHandler fetches entity.
        // UpdateBudgetPlanCommand needs mandatory fields?
        // The handler logic: `budgetPlan.updateBudgetDetails(cmd.budgetType, cmd.allocatedAmount, cmd.fiscalYear);`
        // This implies these fields are mandatory in Command.
        // DTO makes them optional.
        // If DTO is optional, we must fetch first or enforce them.
        // Best practice: if partial update, we need to know current values OR allow partial in command.
        // My UpdateBudgetPlanCommand definition:
        // constructor(..., allocatedAmount: number, budgetType, fiscalYear, status?)
        // Checking step 388: NO optional execution except status.
        // So Controller MUST provide them.
        // But Request DTO has them optional.
        // This is a mismatch.
        // I will fetch existing details in controller to fill gaps? No, that's messy.
        // I should make Command fields optional OR Request mandatory.
        // Given HTTP PATCH, fields are optional.
        // So Command should handle optional.
        // But Handler expects them to call `updateBudgetDetails`.
        // I should create separate methods in domain or pass nulls?
        // I will fetch details in Controller solely to construct Command? No, Application layer should handle logic.
        // I'll update Command to make fields optional. And Handler to use existing if undefined.
        // But I already wrote Command and Handler.
        // I can rewrite Command/Handler or fetch in Controller.
        // Fetching in Controller is easier now without rewriting previous files.
        // I'll fetch `getDetailsHandler`.

        // Wait, reusing `getDetailsHandler` inside `update` method.
        const current = await this.getDetailsHandler.execute(new GetBudgetPlanDetailsQuery(id));

        const cmd = new UpdateBudgetPlanCommand(
            id,
            dto.allocatedAmount ?? current.allocatedAmount,
            dto.budgetType ?? current.budgetType,
            dto.fiscalYear ?? current.fiscalYear,
            dto.status,
        );
        const result = await this.updateHandler.execute(cmd);
        return this.toResponse(result);
    }

    @Permissions('BUDGET_VIEW')
    @Get()
    async getList(
        @Query() query: GetBudgetPlansRequest,
        @Query('organizationId') organizationId: string,
    ): Promise<{ data: BudgetPlanResponse[]; total: number }> {
        const q: GetBudgetPlansQuery = {
            organizationId: organizationId || '',
            options: {
                fiscalYear: query.fiscalYear,
                departmentId: query.departmentId,
                status: query.status,
                budgetType: query.budgetType,
                limit: query.limit,
                offset: query.offset,
            },
        };

        const result = await this.getListHandler.execute(q);
        return {
            data: result.data.map((item) => this.toResponse(item)),
            total: result.total,
        };
    }

    @Permissions('BUDGET_VIEW')
    @Get(':id')
    async getDetails(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<BudgetPlanResponse> {
        const query = new GetBudgetPlanDetailsQuery(id);
        const result = await this.getDetailsHandler.execute(query);
        return this.toResponse(result);
    }

    private toResponse(plan: BudgetPlan): BudgetPlanResponse {
        return {
            id: plan.id,
            organization_id: plan.organizationId,
            department_id: plan.departmentId,
            fiscal_year: plan.fiscalYear,
            budget_type: plan.budgetType,
            allocated_amount: plan.allocatedAmount,
            spent_amount: plan.spentAmount,
            status: plan.status,
            remaining_budget: plan.remainingBudget,
            utilization_rate: plan.utilizationRate,
            created_at: plan.createdAt || new Date(),
            updated_at: plan.updatedAt || new Date(),
        };
    }
}
