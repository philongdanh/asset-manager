import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import {
  CreateAssetCategoryUseCase,
  FindAssetCategoryListUseCase,
} from 'src/application/asset-management/asset-category';
import { AssetCategory } from 'src/domain/modules/asset-category';

@Controller('asset-categories')
export class AssetCategoryController {
  constructor(
    private readonly createAssetCategoryUseCase: CreateAssetCategoryUseCase,
    private readonly getAssetCategoryListUseCase: FindAssetCategoryListUseCase,
  ) {}

  private recursiveChildren(assetCategories: AssetCategory[]): any[] {
    return assetCategories.map((assetCategory) => ({
      id: assetCategory.id,
      name: assetCategory.name,
      code: assetCategory.code,
      parent: assetCategory.parentId,
      children: this.recursiveChildren(assetCategory.children),
    }));
  }

  @Get()
  async find() {
    const assetCategories = await this.getAssetCategoryListUseCase.execute({
      orgId: 'a4feea9c-35bc-45cd-88d8-429c1e30d576',
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.recursiveChildren(assetCategories);
  }

  @Post()
  async create(@Body() dto: CreateAssetCategoryDto) {
    const result = await this.createAssetCategoryUseCase.execute({
      orgId: dto.orgId,
      name: dto.name,
      code: dto.code,
      parentId: dto.parentId,
    });
    return {
      id: result.id,
      name: result.name,
      code: result.code,
      parent: result.parentId,
      children: result.children,
    };
  }
}
