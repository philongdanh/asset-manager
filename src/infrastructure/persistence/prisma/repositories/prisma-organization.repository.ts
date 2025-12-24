import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import {
  IOrganizationRepository,
  Organization,
  OrganizationStatus,
} from 'src/domain/identity/organization';
import { OrganizationMapper } from '../../../mappers/organization.mapper';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private prisma: PrismaService) {}

  async findById(organizationId: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findFirst({
      where: {
        id: organizationId,
        deletedAt: null,
      },
    });

    if (!org) {
      return null;
    }

    return OrganizationMapper.toDomain(org);
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

  async findAll(options?: {
    status?: OrganizationStatus;
    limit?: number;
    offset?: number;
    search?: string;
    includeDeleted?: boolean;
  }): Promise<{ data: Organization[]; total: number }> {
    const where: Prisma.OrganizationWhereInput = {};

    if (!options?.includeDeleted) {
      where.deletedAt = null;
    }

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.search) {
      where.OR = [
        { orgName: { contains: options.search, mode: 'insensitive' } },
        { taxCode: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
        { phone: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        take: options?.limit,
        skip: options?.offset,
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return {
      data: data.map((org) => OrganizationMapper.toDomain(org)),
      total,
    };
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

  async findByEmail(email: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.organization.count({
      where: {
        taxCode: code,
        deletedAt: null,
      },
    });
    return count > 0;
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

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.organization.count({
      where: {
        email,
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
    const persistedOrg = await this.prisma.organization.create({
      data,
    });

    return OrganizationMapper.toDomain(persistedOrg);
  }

  async update(organization: Organization): Promise<Organization> {
    const data = OrganizationMapper.toUpdatePersistence(organization);
    const updatedOrg = await this.prisma.organization.update({
      where: { id: organization.id },
      data,
    });

    return OrganizationMapper.toDomain(updatedOrg);
  }

  async saveMany(organizations: Organization[]): Promise<void> {
    const createData = organizations.map((org) =>
      OrganizationMapper.toPersistence(org),
    );

    await this.prisma.$transaction(
      createData.map((data) => this.prisma.organization.create({ data })),
    );
  }

  async delete(organizationId: string): Promise<void> {
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        status: OrganizationStatus.DELETED,
      },
    });
  }

  async deleteMany(organizationIds: string[]): Promise<void> {
    await this.prisma.organization.updateMany({
      where: { id: { in: organizationIds } },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        status: OrganizationStatus.DELETED,
      },
    });
  }

  async hardDelete(organizationId: string): Promise<void> {
    await this.prisma.organization.delete({
      where: { id: organizationId },
    });
  }

  async hardDeleteMany(organizationIds: string[]): Promise<void> {
    await this.prisma.organization.deleteMany({
      where: { id: { in: organizationIds } },
    });
  }

  async restore(organizationId: string): Promise<void> {
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
        status: OrganizationStatus.ACTIVE,
      },
    });
  }

  async restoreMany(organizationIds: string[]): Promise<void> {
    await this.prisma.organization.updateMany({
      where: { id: { in: organizationIds } },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
        status: OrganizationStatus.ACTIVE,
      },
    });
  }

  async getOrganizationsSummary(): Promise<{
    totalCount: number;
    activeCount: number;
    inactiveCount: number;
    suspendedCount: number;
    deletedCount: number;
  }> {
    const [
      totalCount,
      activeCount,
      inactiveCount,
      suspendedCount,
      deletedCount,
    ] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.organization.count({
        where: { status: OrganizationStatus.ACTIVE, deletedAt: null },
      }),
      this.prisma.organization.count({
        where: { status: OrganizationStatus.INACTIVE, deletedAt: null },
      }),
      this.prisma.organization.count({
        where: { status: OrganizationStatus.SUSPENDED, deletedAt: null },
      }),
      this.prisma.organization.count({
        where: { deletedAt: { not: null } },
      }),
    ]);

    return {
      totalCount,
      activeCount,
      inactiveCount,
      suspendedCount,
      deletedCount,
    };
  }

  async findOrganizationsWithStatus(
    status: OrganizationStatus,
  ): Promise<Organization[]> {
    const where: Prisma.OrganizationWhereInput = {
      status,
    };

    // Nếu status không phải DELETED, exclude deleted records
    if (status !== OrganizationStatus.DELETED) {
      where.deletedAt = null;
    }

    const orgs = await this.prisma.organization.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return orgs.map((org) => OrganizationMapper.toDomain(org));
  }

  async findRecentlyCreated(days: number): Promise<Organization[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const orgs = await this.prisma.organization.findMany({
      where: {
        createdAt: {
          gte: date,
        },
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orgs.map((org) => OrganizationMapper.toDomain(org));
  }
}
