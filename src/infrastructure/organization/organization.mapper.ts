import {
  Prisma,
  Organization as PrismaOrganization,
} from 'generated/prisma/client';
import {
  Organization,
  OrganizationStatus,
} from 'src/domain/identity/organization';

export class OrganizationMapper {
  static toDomain(prismaOrganization: PrismaOrganization): Organization {
    const builder = Organization.builder(
      prismaOrganization.id,
      prismaOrganization.orgName,
    )
      .withStatus(prismaOrganization.status as OrganizationStatus)
      .withTaxCode(prismaOrganization.taxCode)
      .withAddress(prismaOrganization.address)
      .withContactInfo(
        prismaOrganization.phone,
        prismaOrganization.email,
        prismaOrganization.website,
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
      orgName: organization.orgName,
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
    return {
      orgName: organization.orgName,
      status: organization.status,
      taxCode: organization.taxCode,
      address: organization.address,
      phone: organization.phone,
      email: organization.email,
      website: organization.website,
      updatedAt: organization.updatedAt,
      deletedAt: organization.deletedAt,
    };
  }
}
