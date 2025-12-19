import { Injectable } from '@nestjs/common';
import {
  IPermissionRepository,
  Permission,
} from 'src/domain/identity/permission';
import { PrismaService } from '../prisma';
import { PermissionMapper } from './permission.mapper';

@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany({
      include: {
        rolePermissions: {
          include: {
            role: true,
          },
        },
      },
    });
    return permissions.map((permission) =>
      PermissionMapper.toDomain(permission),
    );
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

  async findByName(name: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { name },
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
