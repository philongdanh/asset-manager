import { Injectable, Inject } from '@nestjs/common';
import { Asset } from '../../domain/asset/asset.entity';
import {
  type IAssetRepository,
  ASSET_REPOSITORY,
} from '../../domain/asset/asset.repository.interface';

export interface CreateAssetCommand {
  organizationId: number;
  assetName: string;
  assetCode: string;
  // ... các trường DTO khác
}

@Injectable()
export class CreateAssetUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(command: CreateAssetCommand): Promise<Asset> {
    const { organizationId, assetCode, assetName } = command;

    // 1. Kiểm tra BUSINESS RULE: Mã tài sản phải là duy nhất trong tổ chức
    const existingAsset = await this.assetRepository.findByOrgAndCode(
      organizationId,
      assetCode,
    );

    if (existingAsset) {
      throw new Error('Asset code already exists in this organization.');
    }

    // 2. Tạo Domain Entity (sử dụng logic nghiệp vụ từ Entity)
    const newAsset = Asset.createNew(organizationId, assetName, assetCode);

    // 3. Lưu vào DB thông qua Repository Interface
    return this.assetRepository.save(newAsset);
  }
}
