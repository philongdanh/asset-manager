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
import {
    CreateBudgetPlanCommand,
    UpdateBudgetPlanCommand,
} from '../../application/commands';
import {
    CreateBudgetPlanHandler,
    UpdateBudgetPlanHandler,
} from '../../application/commands';
import {
    GetBudgetPlanDetailsQuery,
    GetBudgetPlansQuery,
} from '../../application/queries';
import {
    GetBudgetPlanDetailsHandler,
    GetBudgetPlansHandler,
} from '../../application/queries';
import { Permissions } from 'src/modules/auth/presentation';
import {
    BudgetPlanResponse,
    CreateBudgetPlanRequest,
    GetBudgetPlansRequest,
    UpdateBudgetPlanRequest,
} from '../dto';
import { BudgetPlan } from '../../domain';
import { plainToInstance } from 'class-transformer';

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
        const current = await this.getDetailsHandler.execute(
            new GetBudgetPlanDetailsQuery(id),
        );

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
        const q = new GetBudgetPlansQuery(organizationId || '', {
            fiscalYear: query.fiscalYear,
            departmentId: query.departmentId,
            status: query.status,
            budgetType: query.budgetType,
            limit: query.limit,
            offset: query.offset,
        });

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
        return plainToInstance(BudgetPlanResponse, plan, {
            excludeExtraneousValues: true,
        });
    }
}
