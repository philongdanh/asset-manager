import { Prisma } from 'generated/prisma/client';
import { Organization, OrganizationStatus } from 'src/domain/organization';
import { AssetMapper } from 'src/infrastructure/asset/asset.mapper';

const organizationInclude = {
  include: {
    assets: true,
  },
} satisfies Prisma.OrganizationDefaultArgs;

export class OrganizationMapper {
  static toDomain(
    org: Prisma.OrganizationGetPayload<typeof organizationInclude>,
  ): Organization {
    const assets = org.assets
      ? org.assets.map((asset) => AssetMapper.toDomain(asset))
      : [];
    const organization = new Organization(
      org.id,
      org.orgName,
      org.status as OrganizationStatus,
      assets,
    );
    return organization;
  }

  static toPersistence(org: Organization): Prisma.OrganizationCreateInput {
    return {
      orgName: org.name,
      status: org.status,
    };
  }
}
