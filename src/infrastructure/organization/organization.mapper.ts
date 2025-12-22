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
    return new Organization(
      prismaOrganization.id,
      prismaOrganization.orgName,
      prismaOrganization.status as OrganizationStatus,
    );
  }

  static toPersistence(
    organization: Organization,
  ): Prisma.OrganizationCreateArgs {
    return {
      data: {
        id: organization.id,
        orgName: organization.name,
        status: organization.status,
      },
      include: {},
    };
  }
}
