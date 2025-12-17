// src/presentation/asset/asset.controller.ts
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
      parentCategoryId: dto.parentCategoryId,
      properties: dto.properties,
    });

    return {
      id: result.id,
      name: result.name,
      code: result.code,
      parentCategoryId: result.parentCategoryId,
      properties: result.properties,
    };
  }
}
