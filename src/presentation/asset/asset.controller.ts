// src/presentation/asset/asset.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateAssetUseCase } from 'src/application/asset/create-asset.use-case';
import { CreateAssetDto } from './dto/create-asset.dto';

@Controller('assets')
export class AssetController {
  constructor(private readonly createAssetUseCase: CreateAssetUseCase) {}

  @Post()
  async create(@Body() dto: CreateAssetDto) {
    const result = await this.createAssetUseCase.execute({
      orgId: dto.orgId,
      name: dto.name,
      code: dto.code,
    });

    return {
      id: result.id,
      name: result.name,
      code: result.code,
    };
  }
}
