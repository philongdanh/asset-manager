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
import { Permissions } from 'src/modules/auth/presentation';
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
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ASSET_CATEGORY_CREATE')
  @Post()
  async create(
    @Body() dto: CreateAssetCategoryRequest,
  ): Promise<AssetCategoryResponse> {
    const cmd = new CreateAssetCategoryCommand(
      dto.organizationId,
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
  ): Promise<AssetCategoryResponse> {
    const cmd = new UpdateAssetCategoryCommand(
      id,
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
  ): Promise<void> {
    const cmd = new DeleteAssetCategoryCommand(id);
    await this.deleteHandler.execute(cmd);
  }

  @Permissions('ASSET_CATEGORY_VIEW')
  @Get()
  async getList(
    @Query() query: GetAssetCategoriesRequest,
    @Query('organizationId') organizationId: string,
  ): Promise<{ data: AssetCategoryResponse[]; total: number }> {
    const q: GetAssetCategoriesQuery = {
      organizationId: organizationId || '',
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
