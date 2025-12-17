import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_REPOSITORY,
  Asset,
  type IAssetRepository,
} from 'src/domain/asset';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

export interface CreateAssetCommand {
  orgId: string;
  name: string;
  code: string;
}

@Injectable()
export class CreateAssetUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateAssetCommand): Promise<Asset> {
    const { orgId, code, name } = command;

    const existingAsset = await this.assetRepository.findByOrgAndCode(
      orgId,
      code,
    );
    if (existingAsset) {
      throw new Error('Asset code already exists in this organization.');
    }

    const id = this.idGenerator.generate();
    const newAsset = Asset.create(id, orgId, name, code);

    return this.assetRepository.save(newAsset);
  }
}
