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
  Delete,
  BadRequestException,
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
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import type { JwtPayload } from 'src/modules/auth/presentation/interfaces/jwt-payload.interface';
import {
  CreateInventoryCheckRequest,
  GetInventoryChecksRequest,
  InventoryCheckResponse,
  InventoryDetailResponse,
  UpdateInventoryCheckDetailsRequest,
  UpdateInventoryCheckRequest,
} from '../dto';
import { InventoryDetail } from '../../domain';
import { plainToInstance } from 'class-transformer';
import { InventoryCheckResult } from '../../application/dtos/inventory-check.result';

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
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('INVENTORY_CREATE')
  @Post()
  async create(
    @Body() dto: CreateInventoryCheckRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<InventoryCheckResponse> {
    const organizationId = user.isRoot
      ? dto.organizationId
      : user.organizationId;

    if (!organizationId) {
      throw new BadRequestException(
        user.isRoot
          ? 'Organization ID is required'
          : 'Current user is not assigned to any organization',
      );
    }

    const cmd = new CreateInventoryCheckCommand(
      organizationId,
      user.id,
      dto.name,
      dto.inventoryDate ? new Date(dto.inventoryDate) : undefined,
      dto.notes,
      dto.assetIds,
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
      dto.name,
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
    @CurrentUser() user: JwtPayload,
  ): Promise<{ data: InventoryCheckResponse[]; total: number }> {
    const organizationId = user.isRoot
      ? query.organizationId
      : user.organizationId;

    if (!organizationId) {
      throw new BadRequestException(
        user.isRoot
          ? 'Organization ID is required'
          : 'Current user is not assigned to any organization',
      );
    }

    const q = new GetInventoryChecksQuery(organizationId, {
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      limit: query.limit,
      offset: query.offset,
      assetIds: query.assetIds,
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
    @CurrentUser() user: JwtPayload,
  ): Promise<InventoryCheckResponse> {
    const query = new GetInventoryCheckQuery(id);
    const result = await this.getHandler.execute(query);

    // Security check for non-root users
    if (
      !user.isRoot &&
      result.inventoryCheck.organizationId !== user.organizationId
    ) {
      throw new BadRequestException(`Inventory check with id ${id} not found`);
    }

    return this.toResponse(result);
  }

  @Permissions('INVENTORY_VIEW')
  @Get(':id/details')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<InventoryCheckResponse> {
    const query = new GetInventoryCheckQuery(id);
    const result = await this.getHandler.execute(query);

    // Security check for non-root users
    if (
      !user.isRoot &&
      result.inventoryCheck.organizationId !== user.organizationId
    ) {
      throw new BadRequestException(`Inventory check with id ${id} not found`);
    }

    return this.toResponse(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('INVENTORY_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.deleteHandler.execute(new DeleteInventoryCheckCommand(id));
  }

  private toResponse(result: InventoryCheckResult): InventoryCheckResponse {
    return new InventoryCheckResponse(result);
  }

  private toDetailResponse(entity: InventoryDetail): InventoryDetailResponse {
    return plainToInstance(InventoryDetailResponse, entity, {
      excludeExtraneousValues: true,
    });
  }
}
