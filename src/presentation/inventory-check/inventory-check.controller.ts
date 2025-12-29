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
  Request,
} from '@nestjs/common';
import {
  CreateInventoryCheckCommand,
  FinishInventoryCheckCommand,
  UpdateInventoryCheckCommand,
  UpdateInventoryCheckDetailsCommand,
} from 'src/application/commands';
import {
  CreateInventoryCheckHandler,
  FinishInventoryCheckHandler,
  UpdateInventoryCheckDetailsHandler,
  UpdateInventoryCheckHandler,
} from 'src/application/commands/handlers';
import {
  GetInventoryCheckDetailsQuery,
  GetInventoryCheckQuery,
  GetInventoryChecksQuery,
} from 'src/application/queries';
import {
  GetInventoryCheckDetailsHandler,
  GetInventoryCheckHandler,
  GetInventoryChecksHandler,
} from 'src/application/queries/handlers';
import { Permissions } from 'src/modules/auth/presentation';
import {
  CreateInventoryCheckRequest,
  GetInventoryChecksRequest,
  InventoryCheckResponse,
  InventoryDetailResponse,
  UpdateInventoryCheckDetailsRequest,
  UpdateInventoryCheckRequest,
} from './dto';
import { InventoryCheck } from 'src/domain/inventory-audit/inventory-check';
import { InventoryDetail } from 'src/domain/inventory-audit/inventory-detail';

@Controller('inventory-checks')
export class InventoryCheckController {
  constructor(
    private readonly createHandler: CreateInventoryCheckHandler,
    private readonly updateHandler: UpdateInventoryCheckHandler,
    private readonly finishHandler: FinishInventoryCheckHandler,
    private readonly updateDetailsHandler: UpdateInventoryCheckDetailsHandler,
    private readonly getListHandler: GetInventoryChecksHandler,
    private readonly getHandler: GetInventoryCheckHandler,
    private readonly getDetailsHandler: GetInventoryCheckDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('INVENTORY_CREATE')
  @Post()
  async create(
    @Body() dto: CreateInventoryCheckRequest,
    @Request() req: any,
  ): Promise<InventoryCheckResponse> {
    const cmd = new CreateInventoryCheckCommand(
      dto.organizationId,
      req.user.id,
      dto.inventoryDate ? new Date(dto.inventoryDate) : undefined,
      dto.notes,
    );
    const result = await this.createHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('INVENTORY_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateInventoryCheckRequest,
  ): Promise<InventoryCheckResponse> {
    const cmd = new UpdateInventoryCheckCommand(
      id,
      dto.notes,
      dto.status,
      dto.inventoryDate ? new Date(dto.inventoryDate) : undefined,
    );
    const result = await this.updateHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('INVENTORY_UPDATE')
  @Post(':id/finish')
  async finish(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<InventoryCheckResponse> {
    const cmd = new FinishInventoryCheckCommand(id);
    const result = await this.finishHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('INVENTORY_UPDATE')
  @Post(':id/details')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateInventoryCheckDetailsRequest,
  ): Promise<void> {
    const cmd = new UpdateInventoryCheckDetailsCommand(id, dto.details);
    await this.updateDetailsHandler.execute(cmd);
  }

  @Permissions('INVENTORY_VIEW')
  @Get()
  async getList(
    @Query() query: GetInventoryChecksRequest,
    @Query('organizationId') organizationId: string,
  ): Promise<{ data: InventoryCheckResponse[]; total: number }> {
    const q: GetInventoryChecksQuery = {
      organizationId: organizationId || '',
      options: {
        status: query.status,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
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

  @Permissions('INVENTORY_VIEW')
  @Get(':id')
  async get(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<InventoryCheckResponse> {
    const query = new GetInventoryCheckQuery(id);
    const result = await this.getHandler.execute(query);
    return this.toResponse(result);
  }

  @Permissions('INVENTORY_VIEW')
  @Get(':id/details')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<InventoryDetailResponse[]> {
    const query = new GetInventoryCheckDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return result.map(this.toDetailResponse);
  }

  private toResponse(entity: InventoryCheck): InventoryCheckResponse {
    return {
      id: entity.id,
      organization_id: entity.organizationId,
      check_date: entity.checkDate,
      checker_user_id: entity.checkerUserId,
      status: entity.status,
      notes: entity.notes,
      created_at: entity.createdAt || new Date(),
      updated_at: entity.updatedAt || new Date(),
    };
  }

  private toDetailResponse(entity: InventoryDetail): InventoryDetailResponse {
    return {
      id: entity.id,
      inventory_check_id: entity.inventoryCheckId,
      asset_id: entity.assetId,
      expected_location: entity.expectedLocation,
      actual_location: entity.actualLocation,
      expected_status: entity.expectedStatus,
      actual_status: entity.actualStatus,
      is_match: entity.isMatch,
      notes: entity.notes,
    };
  }
}
