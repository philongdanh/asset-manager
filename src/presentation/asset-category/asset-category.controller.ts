import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';

@Controller('asset-categories')
export class AssetCategoryController {
  constructor() {}

  @Get()
  async find() {}

  @Post()
  async create(@Body() dto: CreateAssetCategoryDto) {}
}
