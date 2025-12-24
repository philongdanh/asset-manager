import { Injectable } from '@nestjs/common';
import { IRoleRepository, Role } from 'src/domain/identity/role';
import { PrismaService } from '..';
import { RoleMapper } from '../../../mappers/role.mapper';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrganization(organizationId: string): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      where: { organizationId },
    });
    return roles.map((role) => RoleMapper.toDomain(role));
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return role ? RoleMapper.toDomain(role) : null;
  }

  async findByName(organizationId: string, name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: {
        organizationId_roleName: {
          organizationId,
          roleName: name,
        },
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return role ? RoleMapper.toDomain(role) : null;
  }

  async save(role: Role): Promise<Role> {
    const data = RoleMapper.toPersistence(role);

    const savedRole = await this.prisma.$transaction(async (tx) => {
      await tx.role.upsert({
        where: { id: role.id },
        update: data,
        create: data,
      });

      // Delete existing role permissions
      await tx.rolePermission.deleteMany({
        where: { roleId: role.id },
      });

      return tx.role.findUniqueOrThrow({
        where: { id: role.id },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });

    return RoleMapper.toDomain(savedRole);
  }
}
