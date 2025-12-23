import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { IUserRepository, User } from 'src/domain/identity/user';
import { Role } from 'src/domain/identity/role';
import { UserMapper } from './user.mapper';
import { RoleMapper } from '../role';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  findAll(
    organizationId: string,
    options?: {
      departmentId?: string;
      status?: string;
      roleId?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: User[]; total: number }> {
    throw new Error('Method not implemented.');
  }
  findByDepartment(departmentId: string): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  existsByEmail(email: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  existsByUsername(organizationId: string, username: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateRoles(userId: string, roleIds: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async countByOrganizationId(organizationId: string): Promise<number> {
    return this.prisma.user.count({
      where: { organizationId },
    });
  }

  async findByOrganizationId(organizationId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { organizationId },
    });
    const mappedUsers = users.map((user) => UserMapper.toDomain(user));
    return mappedUsers;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByUsername(
    organizationId: string,
    username: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        organizationId_username: {
          organizationId,
          username,
        },
      },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const savedUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: UserMapper.toPersistence(user),
      create: UserMapper.toPersistence(user),
    });
    return UserMapper.toDomain(savedUser);
  }

  async getRolesByUserId(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });
    const mappedRoles = userRoles.map((userRole) =>
      RoleMapper.toDomain(userRole.role),
    );
    return mappedRoles;
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      update: {},
      create: {
        userId,
        roleId,
      },
    });
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.delete({
      where: {
        userId_roleId: { userId, roleId },
      },
    });
  }
}
