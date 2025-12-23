import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  IOrganizationRepository,
  Organization,
  OrganizationStatus,
} from 'src/domain/identity/organization';
import { OrganizationMapper } from './organization.mapper';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!org) {
      return null;
    }

    return OrganizationMapper.toDomain(org);
  }

  async findByCode(taxCode: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findFirst({
      where: {
        taxCode: taxCode,
        deletedAt: null,
      },
    });

    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async findAll(options?: {
    status?: string;
    limit?: number;
    offset?: number;
    search?: string;
    includeDeleted?: boolean;
  }): Promise<{ data: Organization[]; total: number }> {
    const where: Prisma.OrganizationWhereInput = {};
    if (!options?.includeDeleted) {
      where.deletedAt = null;
    }
    if (options?.status) where.status = options.status;
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

  async isActive(id: string): Promise<boolean> {
    const org = await this.findById(id);
    return org ? org.status === OrganizationStatus.ACTIVE : false;
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

  async delete(id: string): Promise<void> {
    // Soft delete
    await this.prisma.organization.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.organization.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.prisma.organization.delete({
      where: { id },
    });
  }

  async hardDeleteMany(ids: string[]): Promise<void> {
    await this.prisma.organization.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async restore(id: string): Promise<void> {
    await this.prisma.organization.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
        status: 'ACTIVE',
      },
    });
  }

  async restoreMany(ids: string[]): Promise<void> {
    await this.prisma.organization.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
        status: 'ACTIVE',
      },
    });
  }

  async updateInfo(organizationId: string, newName: string): Promise<void> {
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        orgName: newName,
        updatedAt: new Date(),
      },
    });
  }

  async setStatus(organizationId: string, status: boolean): Promise<void> {
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        status: status ? 'ACTIVE' : 'INACTIVE',
        updatedAt: new Date(),
      },
    });
  }

  async find(): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: { deletedAt: null },
    });
    return organizations.map((org) => OrganizationMapper.toDomain(org));
  }
}
