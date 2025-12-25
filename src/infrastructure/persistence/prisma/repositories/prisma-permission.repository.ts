import { Injectable } from '@nestjs/common';
import {
  IPermissionRepository,
  Permission,
} from 'src/domain/identity/permission';
import { PrismaService } from '..';
import { PermissionMapper } from '../../../mappers/permission.mapper';

@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByRole(roleId: string): Promise<Permission[]> {
    const permission = await this.prisma.permission.findMany({
      where: {
        rolePermissions: {
          every: {
            roleId,
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

  async find(): Promise<{ data: Permission[]; total: number }> {
    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({
        include: {
          rolePermissions: {
            include: {
              role: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.permission.count(),
    ]);

    return {
      data: data.map((permission) => PermissionMapper.toDomain(permission)),
      total,
    };
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            role: true,
          },
        },
      },
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
