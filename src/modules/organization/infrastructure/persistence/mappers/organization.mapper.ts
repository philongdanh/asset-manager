import {
  Prisma,
  Organization as PrismaOrganization,
} from 'generated/prisma/client';
import { Organization, OrganizationStatus } from '../../../domain';

export class OrganizationMapper {
  static toDomain(prismaOrganization: PrismaOrganization): Organization {
    const builder = Organization.builder(
      prismaOrganization.id,
      prismaOrganization.orgName,
    )
      .withStatus(this.mapStringToOrganizationStatus(prismaOrganization.status))
      .withTaxCode(prismaOrganization.taxCode)
      .withContactInfo(
        prismaOrganization.phone,
        prismaOrganization.email,
        prismaOrganization.website,
        prismaOrganization.address,
      )
      .withTimestamps(
        prismaOrganization.createdAt,
        prismaOrganization.updatedAt,
        prismaOrganization.deletedAt,
      );

    return builder.build();
  }

  static toPersistence(
    organization: Organization,
  ): Prisma.OrganizationCreateInput {
    return {
      id: organization.id,
      orgName: organization.name,
      status: organization.status,
      taxCode: organization.taxCode,
      address: organization.address,
      phone: organization.phone,
      email: organization.email,
      website: organization.website,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      deletedAt: organization.deletedAt,
    };
  }

  static toUpdatePersistence(
    organization: Organization,
  ): Prisma.OrganizationUpdateInput {
    const updateData: Prisma.OrganizationUpdateInput = {
      orgName: organization.name,
      status: organization.status,
      taxCode: organization.taxCode,
      address: organization.address,
      phone: organization.phone,
      email: organization.email,
      website: organization.website,
      updatedAt: organization.updatedAt,
    };

    // Only include deletedAt if it's explicitly set
    if (organization.deletedAt !== undefined) {
      updateData.deletedAt = organization.deletedAt;
    }

    return updateData;
  }

  private static mapStringToOrganizationStatus(
    status: string,
  ): OrganizationStatus {
    const statusMap: Record<string, OrganizationStatus> = {
      ACTIVE: OrganizationStatus.ACTIVE,
      INACTIVE: OrganizationStatus.INACTIVE,
    };

    return statusMap[status] || OrganizationStatus.INACTIVE;
  }
}
