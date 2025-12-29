import { Injectable } from '@nestjs/common';
import {
  type IOrganizationRepository,
  OrganizationStatus,
  Organization,
} from '../../../domain';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { OrganizationMapper } from '../mappers/organization.mapper';

@Injectable()
export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private prisma: PrismaService) {}

  async find(
    status?: OrganizationStatus,
    includeDeleted?: boolean,
  ): Promise<Organization[]> {
    const orgs = await this.prisma.organization.findMany({
      where: {
        status,
        deletedAt: includeDeleted ? { not: null } : null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return orgs.map((org) => OrganizationMapper.toDomain(org));
  }

  async findById(organizationId: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findFirst({
      where: {
        id: organizationId,
        deletedAt: null,
      },
    });
    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async existsById(organizationId: string): Promise<boolean> {
    const count = await this.prisma.organization.count({
      where: {
        id: organizationId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async save(organization: Organization): Promise<Organization> {
    const data = OrganizationMapper.toPersistence(organization);
    const persistedOrg = await this.prisma.organization.upsert({
      where: { id: organization.id },
      create: data,
      update: data,
    });
    return OrganizationMapper.toDomain(persistedOrg);
  }

  async delete(organizationIds: string[]): Promise<void> {
    await this.prisma.organization.deleteMany({
      where: {
        id: {
          in: organizationIds,
        },
      },
    });
  }
}
