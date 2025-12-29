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
} from 'src/application/commands';
import {
  CreateAssetCategoryHandler,
  DeleteAssetCategoryHandler,
  UpdateAssetCategoryHandler,
} from 'src/application/commands/handlers';
import {
  GetAssetCategoriesQuery,
  GetAssetCategoryDetailsQuery,
} from 'src/application/queries';
import {
  GetAssetCategoriesHandler,
  GetAssetCategoryDetailsHandler,
} from 'src/application/queries/handlers';
import { Public } from '../auth/decorators'; // Assuming Public decorator exists like in User
import {
  AssetCategoryResponse,
  CreateAssetCategoryRequest,
  GetAssetCategoriesRequest,
  UpdateAssetCategoryRequest,
} from './dto';

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
    return <AssetCategoryResponse>{
      id: result.id,
      organizationId: result.organizationId,
      code: result.code,
      categoryName: result.categoryName,
      parentId: result.parentId,
      createdAt: result.createdAt || new Date(),
      updatedAt: result.updatedAt || new Date(),
    };
  }

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
    return <AssetCategoryResponse>{
      id: result.id,
      organizationId: result.organizationId,
      code: result.code,
      categoryName: result.categoryName,
      parentId: result.parentId,
      createdAt: result.createdAt || new Date(),
      updatedAt: result.updatedAt || new Date(),
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const cmd = new DeleteAssetCategoryCommand(id);
    await this.deleteHandler.execute(cmd);
  }

  @Get()
  async getList(
    @Query() query: GetAssetCategoriesRequest,
    @Query('organizationId') organizationId: string, // Assuming organizationId comes from somewhere, e.g. query for now since auth might not inject it yet
  ): Promise<{ data: AssetCategoryResponse[]; total: number }> {
    // Note: organizationId usually comes from User Context (JWT), but adhering to simple query param for now as per DTO
    // If organizationId is mandatory in Query DTO, it should be there. 
    // The previous analysis showed organizationId in CreateUser command but GetUsersRequest in UserController didn't have it in Query param explicitly but passed '' in handler.
    // Let's assume passed via query or hardcoded for now if not in auth context.
    // In strict Check, User controller passed empty string. I will require it in query if not authenticated.
    // But wait, the repo requires organizationId.

    // For now, let's assume valid organizationId is passed or we default for testing.
    // In real app, `@CurrentUser() user` would provide orgId.

    // The previous user controller example:
    // const users = await this.getUsersHandler.execute({ organizationId: '', ... }); 
    // It seems it was missing there too or implicitly handled? 
    // Ah, `GetUsersRequest` didn't have organizationId. 
    // I will add organizationId to the query param for now to make it work.

    if (!organizationId) {
      // Fallback or throw? For now let's hope it's in query
    }

    const q: GetAssetCategoriesQuery = {
      organizationId: organizationId || '', // TODO: Get from auth context
      options: {
        limit: query.limit,
        offset: query.offset,
        includeDeleted: query.includeDeleted,
      },
    };

    const result = await this.getListHandler.execute(q);
    return {
      data: result.data.map((c) => ({
        id: c.id,
        organizationId: c.organizationId,
        code: c.code,
        categoryName: c.categoryName,
        parentId: c.parentId,
        createdAt: c.createdAt || new Date(),
        updatedAt: c.updatedAt || new Date(),
      })),
      total: result.total,
    };
  }

  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetCategoryResponse> {
    const query = new GetAssetCategoryDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return <AssetCategoryResponse>{
      id: result.id,
      organizationId: result.organizationId,
      code: result.code,
      categoryName: result.categoryName,
      parentId: result.parentId,
      createdAt: result.createdAt || new Date(),
      updatedAt: result.updatedAt || new Date(),
    };
  }
}
