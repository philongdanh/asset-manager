import { Prisma, Organization as PrismaOrg } from 'generated/prisma/client';
import { Organization, OrganizationStatus } from 'src/domain/organization';

export class OrganizationMapper {
  static toDomain(org: PrismaOrg): Organization {
    return new Organization(
      org.id,
      org.orgName,
      org.status as OrganizationStatus,
    );
  }

  static toPersistence(org: Organization): Prisma.OrganizationCreateInput {
    return {
      orgName: org.name,
      status: org.status,
    };
  }
}
