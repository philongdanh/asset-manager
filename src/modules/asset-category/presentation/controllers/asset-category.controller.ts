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
import {
  CreateAssetCategoryCommand,
  DeleteAssetCategoryCommand,
  UpdateAssetCategoryCommand,
  GetAssetCategoriesQuery,
  GetAssetCategoryDetailsQuery,
  CreateAssetCategoryHandler,
  DeleteAssetCategoryHandler,
  UpdateAssetCategoryHandler,
  GetAssetCategoriesHandler,
  GetAssetCategoryDetailsHandler,
} from '../../application';
import { Permissions, CurrentUser } from 'src/modules/auth/presentation';
import type { JwtPayload } from 'src/modules/auth/presentation/interfaces/jwt-payload.interface';
import {
  AssetCategoryResponse,
  CreateAssetCategoryRequest,
  GetAssetCategoriesRequest,
  UpdateAssetCategoryRequest,
} from '../dto';
import { AssetCategory } from '../../domain';

@Controller('asset-categories')
export class AssetCategoryController {
  constructor(
    private readonly createHandler: CreateAssetCategoryHandler,
    private readonly updateHandler: UpdateAssetCategoryHandler,
    private readonly deleteHandler: DeleteAssetCategoryHandler,
    private readonly getListHandler: GetAssetCategoriesHandler,
    private readonly getDetailsHandler: GetAssetCategoryDetailsHandler,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ASSET_CATEGORY_CREATE')
  @Post()
  async create(
    @Body() dto: CreateAssetCategoryRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetCategoryResponse> {
    const cmd = new CreateAssetCategoryCommand(
      user.organizationId ?? dto.organizationId,
      dto.code,
      dto.categoryName,
      dto.parentId || null,
    );
    const result = await this.createHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('ASSET_CATEGORY_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateAssetCategoryRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetCategoryResponse> {
    const cmd = new UpdateAssetCategoryCommand(
      id,
      user.organizationId,
      dto.categoryName,
      dto.code,
      dto.parentId || null,
    );
    const result = await this.updateHandler.execute(cmd);
    return this.toResponse(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('ASSET_CATEGORY_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    const cmd = new DeleteAssetCategoryCommand(id, user.organizationId);
    await this.deleteHandler.execute(cmd);
  }

  @Permissions('ASSET_CATEGORY_VIEW')
  @Get()
  async getList(
    @Query() query: GetAssetCategoriesRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ data: AssetCategoryResponse[]; total: number }> {
    const q: GetAssetCategoriesQuery = {
      organizationId: (user.organizationId ?? query.organizationId) || '',
      options: {
        limit: query.limit,
        offset: query.offset,
        includeDeleted: query.includeDeleted,
      },
    };

    const result = await this.getListHandler.execute(q);
    return {
      data: result.data.map((c) => this.toResponse(c)),
      total: result.total,
    };
  }

  @Permissions('ASSET_CATEGORY_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetCategoryResponse> {
    const query = new GetAssetCategoryDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  private toResponse(entity: AssetCategory): AssetCategoryResponse {
    return new AssetCategoryResponse(entity);
  }
}
