// src/presentation/asset/asset.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';

@Controller('assets')
export class AssetController {
  constructor() {}

  @Post()
  async create(@Body() dto: CreateAssetDto) {}
}
