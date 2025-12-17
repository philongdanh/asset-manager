import { Controller, Post, Body } from '@nestjs/common';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { CreateAssetCategoryUseCase } from 'src/application/asset-category';

@Controller('asset-categories')
export class AssetCategoryController {
  constructor(
    private readonly createAssetCategoryUseCase: CreateAssetCategoryUseCase,
  ) {}

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
