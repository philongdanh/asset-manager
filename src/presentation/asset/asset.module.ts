import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { CreateAssetUseCase } from 'src/application/asset/create-asset.use-case';
import { ASSET_REPOSITORY } from 'src/domain/asset/asset.repository.interface';
import { PrismaAssetRepository } from 'src/infrastructure/asset/prisma-asset.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
// Import PrismaService ở đây hoặc Global Module

@Module({
  controllers: [AssetController],
  providers: [
    // 1. Đăng ký Use Case
    CreateAssetUseCase,
    // 2. Đăng ký Custom Provider: Liên kết Interface với Implementation
    {
      provide: ASSET_REPOSITORY,
      useClass: PrismaAssetRepository,
    },
    // ... các Use Case và Repository khác cho Asset
    PrismaService,
  ],
})
export class AssetModule {}
