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
  Delete,
} from '@nestjs/common';
import {
  CreateInventoryCheckCommand,
  FinishInventoryCheckCommand,
  UpdateInventoryCheckCommand,
  UpdateInventoryCheckDetailsCommand,
  DeleteInventoryCheckCommand,
} from '../../application/commands';
import {
  CreateInventoryCheckHandler,
  FinishInventoryCheckHandler,
  UpdateInventoryCheckDetailsHandler,
  UpdateInventoryCheckHandler,
  DeleteInventoryCheckHandler,
} from '../../application/commands';
import {
  GetInventoryCheckDetailsQuery,
  GetInventoryCheckQuery,
  GetInventoryChecksQuery,
} from '../../application/queries';
import {
  GetInventoryCheckDetailsHandler,
  GetInventoryCheckHandler,
  GetInventoryChecksHandler,
} from '../../application/queries';
import { Permissions } from 'src/modules/auth/presentation';
import {
  CreateInventoryCheckRequest,
  GetInventoryChecksRequest,
  InventoryCheckResponse,
  InventoryDetailResponse,
  UpdateInventoryCheckDetailsRequest,
  UpdateInventoryCheckRequest,
} from '../dto';
import { InventoryCheck, InventoryDetail } from '../../domain';
import { plainToInstance } from 'class-transformer';

@Controller('inventory-checks')
export class InventoryCheckController {
  constructor(
    private readonly createHandler: CreateInventoryCheckHandler,
    private readonly updateHandler: UpdateInventoryCheckHandler,
    private readonly finishHandler: FinishInventoryCheckHandler,
    private readonly updateDetailsHandler: UpdateInventoryCheckDetailsHandler,
    private readonly deleteHandler: DeleteInventoryCheckHandler,
    private readonly getListHandler: GetInventoryChecksHandler,
    private readonly getHandler: GetInventoryCheckHandler,
    private readonly getDetailsHandler: GetInventoryCheckDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('INVENTORY_CREATE')
  @Post()
  async create(
    @Body() dto: CreateInventoryCheckRequest,
    @Request() req: { user: { id: string } },
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
    const q = new GetInventoryChecksQuery(organizationId || '', {
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      limit: query.limit,
      offset: query.offset,
    });

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
    return result.map((item) => this.toDetailResponse(item));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('INVENTORY_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.deleteHandler.execute(new DeleteInventoryCheckCommand(id));
  }

  private toResponse(entity: InventoryCheck): InventoryCheckResponse {
    return plainToInstance(InventoryCheckResponse, entity, {
      excludeExtraneousValues: true,
    });
  }

  private toDetailResponse(entity: InventoryDetail): InventoryDetailResponse {
    return plainToInstance(InventoryDetailResponse, entity, {
      excludeExtraneousValues: true,
    });
  }
}
