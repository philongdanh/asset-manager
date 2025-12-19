import { Injectable, Inject } from '@nestjs/common';
import { EntityAlreadyExistsException } from 'src/domain/core';
import {
  ASSET_REPOSITORY,
  Asset,
  type IAssetRepository,
} from 'src/domain/modules/asset';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CreateAssetCommand } from './create-asset.command';
import {
  type IOrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from 'src/domain/modules/organization';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/modules/department';

@Injectable()
export class CreateAssetUseCase {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(command: CreateAssetCommand): Promise<Asset> {
    const existingOrganization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!existingOrganization) {
      throw new EntityAlreadyExistsException(
        Asset.name,
        'organizationId',
        command.organizationId,
      );
    }
    const existingAsset = await this.assetRepository.findByOrgAndCode(
      command.organizationId,
      command.code,
    );
    if (existingAsset) {
      throw new EntityAlreadyExistsException(Asset.name, 'code', command.code);
    }

    if (command.departmentId) {
      const existingDepartment = await this.departmentRepository.findById(
        command.departmentId,
      );
      if (!existingDepartment) {
        throw new EntityAlreadyExistsException(
          Asset.name,
          'departmentId',
          command.departmentId,
        );
      }
    }

    const id = this.idGenerator.generate();
    const asset = Asset.create(
      id,
      command.organizationId,
      command.departmentId,
      command.name,
      command.code,
    );
    return this.assetRepository.save(asset);
  }
}
