import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  Organization,
  type IOrgRepository,
} from 'src/domain/organization';

export interface GetOrgsCommand {}

@Injectable()
export class GetOrganizationsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: IOrgRepository,
  ) {}

  async execute(command: GetOrgsCommand): Promise<Organization[]> {
    const {} = command;
    return this.orgRepository.find();
  }
}
