import { Injectable } from '@nestjs/common';
import { IPermissionRepository, Permission } from '../../../domain';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { PermissionMapper } from '../mappers/permission.mapper';

@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(): Promise<Permission[]> {
    const perms = await this.prisma.permission.findMany({});
    return perms.map((perm) => PermissionMapper.toDomain(perm));
  }

  async findByRoles(roleIds: string[]): Promise<Permission[]> {
    const permission = await this.prisma.permission.findMany({
      where: {
        rolePermissions: {
          every: {
            roleId: {
              in: roleIds,
            },
          },
        },
      },
    });
    return permission.map((permission) =>
      PermissionMapper.toDomain(permission),
    );
  }

  async existsById(permissionId: string): Promise<boolean> {
    const count = await this.prisma.permission.count({
      where: { id: permissionId },
    });
    return count > 0;
  }

  async delete(permissionIds: string[]): Promise<void> {
    if (permissionIds.length === 0) return;
    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({
        where: { permissionId: { in: permissionIds } },
      }),
      this.prisma.permission.deleteMany({
        where: { id: { in: permissionIds } },
      }),
    ]);
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    return permission ? PermissionMapper.toDomain(permission) : null;
  }

  async save(permission: Permission): Promise<Permission> {
    const data = PermissionMapper.toPersistence(permission);
    const savedPermission = await this.prisma.permission.upsert({
      where: { id: permission.id },
      update: data,
      create: data,
    });
    return PermissionMapper.toDomain(savedPermission);
  }
}
