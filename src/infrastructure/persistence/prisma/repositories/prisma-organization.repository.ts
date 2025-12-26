import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import {
  type IOrganizationRepository,
  OrganizationStatus,
  Organization,
} from 'src/domain/identity/organization';
import { PrismaService } from '../prisma.service';
import { OrganizationMapper } from 'src/infrastructure/mappers/organization.mapper';

@Injectable()
export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private prisma: PrismaService) {}

  async find(
    status?: OrganizationStatus,
    includeDeleted?: boolean,
  ): Promise<Organization[]> {
    const where: Prisma.OrganizationWhereInput = {};
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    if (status) {
      // Map enum to string for Prisma query
      where.status = status;
    }
    const orgs = await this.prisma.organization.findMany({
      where: {
        status,
        deletedAt: includeDeleted
          ? {
              not: null,
            }
          : null,
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

  async findByCode(code: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findFirst({
      where: {
        taxCode: code,
        deletedAt: null,
      },
    });
    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async findByTaxCode(taxCode: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findFirst({
      where: {
        taxCode,
        deletedAt: null,
      },
    });
    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async existsByTaxCode(taxCode: string): Promise<boolean> {
    const count = await this.prisma.organization.count({
      where: {
        taxCode,
        deletedAt: null,
      },
    });
    return count > 0;
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
    const organizations = await this.prisma.organization.findMany({
      where: { id: { in: organizationIds } },
    });
    await this.prisma.$transaction(
      organizations.map((prismaOrg) => {
        const org = OrganizationMapper.toDomain(prismaOrg);
        org.markAsDeleted();
        const data = OrganizationMapper.toUpdatePersistence(org);
        return this.prisma.organization.update({
          where: { id: org.id },
          data,
        });
      }),
    );
  }

  async hardDelete(organizationIds: string[]): Promise<void> {
    await this.prisma.organization.deleteMany({
      where: { id: { in: organizationIds } },
    });
  }

  async restore(organizationIds: string[]): Promise<void> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        id: { in: organizationIds },
        deletedAt: { not: null },
      },
    });

    await this.prisma.$transaction(
      organizations.map((prismaOrg) => {
        const org = OrganizationMapper.toDomain(prismaOrg);
        org.restore();
        const data = OrganizationMapper.toUpdatePersistence(org);
        return this.prisma.organization.update({
          where: { id: org.id },
          data,
        });
      }),
    );
  }
}
