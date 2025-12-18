import { Injectable } from '@nestjs/common';
import { IRoleRepository, Role } from 'src/domain/identity/role';
import { PrismaService } from '../prisma';
import { RoleMapper } from './role.mapper';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      where: { organizationId },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return roles.map(RoleMapper.toDomain);
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

    // Handle permissions update (delete existing and create new)
    // This is a simple approach. For optimization, we could diff.
    const permissionIds = role.permissions.map((p) => p.id);

    const savedRole = await this.prisma.$transaction(async (tx) => {
      // Update Role basic info
      const updatedRole = await tx.role.upsert({
        where: { id: role.id },
        update: data,
        create: data,
      });

      // Delete existing role permissions
      await tx.rolePermission.deleteMany({
        where: { roleId: role.id },
      });

      // Create new role permissions
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permId) => ({
            roleId: role.id,
            permissionId: permId,
          })),
        });
      }

      // Return full role with permissions
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
