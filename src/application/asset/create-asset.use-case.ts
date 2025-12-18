import { Injectable, Inject } from '@nestjs/common';
import { EntityAlreadyExistsException } from 'src/domain/core';
import {
  ASSET_REPOSITORY,
  Asset,
  type IAssetRepository,
} from 'src/domain/modules/asset';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

@Injectable()
export class CreateAssetUseCase {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(
    organizationId: string,
    name: string,
    code: string,
  ): Promise<Asset> {
    const existingAsset = await this.assetRepository.findByOrgAndCode(
      organizationId,
      code,
    );
    if (existingAsset) {
      throw new EntityAlreadyExistsException(Asset.name, 'code', code);
    }

    const id = this.idGenerator.generate();
    const newAsset = Asset.create(id, organizationId, name, code);
    return this.assetRepository.save(newAsset);
  }
}
