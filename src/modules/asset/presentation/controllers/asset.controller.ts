import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CreateAssetCommand } from '../../application/commands/create-asset/create-asset.command';
import { DeleteAssetCommand } from '../../application/commands/delete-asset/delete-asset.command';
import { UpdateAssetCommand } from '../../application/commands/update-asset/update-asset.command';
import { CreateAssetHandler } from '../../application/commands/create-asset/create-asset.handler';
import { DeleteAssetHandler } from '../../application/commands/delete-asset/delete-asset.handler';
import { UpdateAssetHandler } from '../../application/commands/update-asset/update-asset.handler';
import { GetAssetDetailsQuery } from '../../application/queries/get-asset-details/get-asset-details.query';
import { GetAssetDetailsHandler } from '../../application/queries/get-asset-details/get-asset-details.handler';
import { GetAssetsHandler } from '../../application/queries/get-assets/get-assets.handler';
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import type { JwtPayload } from 'src/modules/auth/presentation/interfaces/jwt-payload.interface';
import { AssetResult } from '../../application/dtos/asset.result';
import {
  AssetResponse,
  CreateAssetRequest,
  GetAssetsRequest,
  UpdateAssetRequest,
} from '../dto';

@Controller('assets')
export class AssetController {
  constructor(
    private readonly createHandler: CreateAssetHandler,
    private readonly updateHandler: UpdateAssetHandler,
    private readonly deleteHandler: DeleteAssetHandler,
    private readonly getListHandler: GetAssetsHandler,
    private readonly getDetailsHandler: GetAssetDetailsHandler,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ASSET_CREATE')
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateAssetRequest,
  ): Promise<AssetResponse> {
    const userId = user.id;
    const organizationId = user.isRoot
      ? dto.organizationId
      : user.organizationId;

    if (!organizationId) {
      if (!user.isRoot && !user.organizationId) {
        throw new BadRequestException(
          'Current user is not assigned to any organization',
        );
      }
      throw new BadRequestException('Organization ID is required');
    }

    const cmd = new CreateAssetCommand(
      organizationId,
      dto.assetCode,
      dto.assetName,
      dto.categoryId,
      userId,
      dto.purchasePrice,
      dto.originalCost,
      dto.currentValue,
      dto.model || null,
      dto.serialNumber || null,
      dto.manufacturer || null,
      dto.purchaseDate || null,
      dto.warrantyExpiryDate || null,
      dto.location || null,
      dto.specifications ? JSON.stringify(dto.specifications) : null,
      dto.condition || null,
      dto.status || null,
      dto.imageUrl || null,
    );
    const result = await this.createHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('ASSET_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateAssetRequest,
  ): Promise<AssetResponse> {
    const cmd = new UpdateAssetCommand(
      id,
      dto.assetName,
      dto.categoryId,
      dto.model || null,
      dto.serialNumber || null,
      dto.manufacturer || null,
      dto.purchasePrice,
      dto.originalCost,
      dto.currentValue,
      dto.purchaseDate || null,
      dto.warrantyExpiryDate || null,
      dto.condition || null,
      dto.location || null,
      dto.specifications ? JSON.stringify(dto.specifications) : null,
      dto.status || '',
      dto.imageUrl || null,
    );
    const result = await this.updateHandler.execute(cmd);
    return this.toResponse(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('ASSET_DELETE')
  @Delete(':id')
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    if (!user.organizationId) {
      throw new BadRequestException(
        'Current user is not assigned to any organization',
      );
    }
    const cmd = new DeleteAssetCommand(user.organizationId, user.id, id);
    await this.deleteHandler.execute(cmd);
  }

  @Permissions('ASSET_VIEW')
  @Get()
  async getList(
    @Query() query: GetAssetsRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ data: AssetResponse[]; total: number }> {
    const organizationId = user.isRoot
      ? query.organizationId
      : user.organizationId;

    if (!organizationId) {
      if (!user.isRoot && !user.organizationId) {
        throw new BadRequestException(
          'Current user is not assigned to any organization',
        );
      }
    }

    const result = await this.getListHandler.execute({
      organizationId: organizationId || '',
      options: {
        status: query.status,
        categoryId: query.categoryId,
        departmentId: query.departmentId,
        userId: query.userId,
        search: query.search,
        limit: query.limit,
        offset: query.offset,
        includeDeleted: query.includeDeleted,
      },
    });
    return {
      data: result.data.map((item) => this.toResponse(item)),
      total: result.total,
    };
  }

  @Permissions('ASSET_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetResponse> {
    const result = await this.getDetailsHandler.execute(
      new GetAssetDetailsQuery(id),
    );

    if (!user.isRoot && result.asset.organizationId !== user.organizationId) {
      // Return 404 to avoid leaking existence of asset in other orgs
      throw new BadRequestException(`Asset with id ${id} not found`); // Or NotFoundException
    }

    return this.toResponse(result);
  }

  private toResponse(result: AssetResult): AssetResponse {
    return new AssetResponse(result);
  }
}
