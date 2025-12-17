import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { IOrgRepository, Organization } from 'src/domain/organization';
import { OrganizationMapper } from './organization.mapper';

@Injectable()
export class PrismaOrgRepository implements IOrgRepository {
  constructor(private prisma: PrismaService) {}

  async find(): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      include: {
        assets: true,
      },
    });
    return organizations.map((org) => OrganizationMapper.toDomain(org));
  }

  async findById(id: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        assets: true,
      },
    });

    if (!org) {
      return null;
    }

    return OrganizationMapper.toDomain(org);
  }

  async save(org: Organization): Promise<Organization> {
    const persistedOrg = await this.prisma.organization.upsert({
      where: { id: org.id },
      update: OrganizationMapper.toPersistence(org),
      create: OrganizationMapper.toPersistence(org),
      include: {
        assets: true,
      },
    });

    if (!persistedOrg) {
      throw new Error('Failed to save organization.');
    }

    return OrganizationMapper.toDomain(persistedOrg);
  }
}
