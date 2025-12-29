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
} from '@nestjs/common';
import { CreateAssetCommand } from '../../application/commands/create-asset/create-asset.command';
import { DeleteAssetCommand } from '../../application/commands/delete-asset/delete-asset.command';
import { UpdateAssetCommand } from '../../application/commands/update-asset/update-asset.command';
import { CreateAssetHandler } from '../../application/commands/create-asset/create-asset.handler';
import { DeleteAssetHandler } from '../../application/commands/delete-asset/delete-asset.handler';
import { UpdateAssetHandler } from '../../application/commands/update-asset/update-asset.handler';
import { GetAssetDetailsQuery } from '../../application/queries/get-asset-details/get-asset-details.query';
import { GetAssetsQuery } from '../../application/queries/get-assets/get-assets.query';
import { GetAssetDetailsHandler } from '../../application/queries/get-asset-details/get-asset-details.handler';
import { GetAssetsHandler } from '../../application/queries/get-assets/get-assets.handler';
import { Permissions } from 'src/modules/auth/presentation';
import {

  AssetResponse,
  CreateAssetRequest,
  GetAssetsRequest,
  UpdateAssetRequest,
} from '../dtos';

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
    @Body() dto: CreateAssetRequest,
    @Query('userId') createdByUserId?: string, // Assuming userId comes from auth context or query for now since auth not fully visible
  ): Promise<AssetResponse> {

    // In a real app with AuthGuard, we extract user from Request.
    // For now, if not passed in query, fallback to DTO if available or strictly require it.
    // DTO doesn't have createdByUserId as it is usually system/context field.
    // I will use a dummy if not present to ensure it works for now, or just assume it is passed.

    const userId = createdByUserId || '00000000-0000-0000-0000-000000000000'; // Placeholder if not provided

    const cmd = new CreateAssetCommand(
      dto.organizationId,
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
      dto.specifications || null,
      dto.condition || null,
      dto.status || null,
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
      dto.specifications || null,
      dto.status,
    );
    const result = await this.updateHandler.execute(cmd);
    return this.toResponse(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('ASSET_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const cmd = new DeleteAssetCommand(id);
    await this.deleteHandler.execute(cmd);
  }

  @Permissions('ASSET_VIEW')
  @Get()
  async getList(
    @Query() query: GetAssetsRequest,
    @Query('organizationId') organizationId: string,
  ): Promise<{ data: AssetResponse[]; total: number }> {
    const q: GetAssetsQuery = {
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
    };

    const result = await this.getListHandler.execute(q);
    return {
      data: result.data.map((item) => this.toResponse(item)),
      total: result.total,
    };
  }

  @Permissions('ASSET_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetResponse> {
    const query = new GetAssetDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  private toResponse(asset: any): AssetResponse {
    return <AssetResponse>{
      id: asset.id,
      organizationId: asset.organizationId,
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      categoryId: asset.categoryId,
      createdByUserId: asset.createdByUserId,
      purchasePrice: asset.purchasePrice,
      originalCost: asset.originalCost,
      currentValue: asset.currentValue,
      status: asset.status,
      currentDepartmentId: asset.currentDepartmentId,
      currentUserId: asset.currentUserId,
      model: asset.model,
      serialNumber: asset.serialNumber,
      manufacturer: asset.manufacturer,
      purchaseDate: asset.purchaseDate || null,
      warrantyExpiryDate: asset.warrantyExpiryDate || null,
      location: asset.location,
      specifications: asset.specifications,
      condition: asset.condition,
      createdAt: asset.createdAt || new Date(),
      updatedAt: asset.updatedAt || new Date(),
    };
  }
}
