import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { DepartmentMapper } from '../../../mappers/department.mapper';
import {
  Department,
  IDepartmentRepository,
} from 'src/domain/identity/department';
import { DepartmentWhereInput } from 'generated/prisma/models';

@Injectable()
export class PrismaDepartmentRepository implements IDepartmentRepository {
  constructor(private prisma: PrismaService) {}

  async find(
    organizationId: string,
    options?: { parentId?: string | null; includeDeleted?: boolean },
  ): Promise<{ data: Department[]; total: number }> {
    const where: DepartmentWhereInput = {
      organizationId,
      deletedAt: options?.includeDeleted ? undefined : null,
    };

    if (options?.parentId !== undefined) {
      where.parentId = options.parentId;
    }

    const [departments, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.department.count({ where }),
    ]);

    return {
      data: departments.map((d) => DepartmentMapper.toDomain(d)),
      total,
    };
  }

  async findByOrganization(organizationId: string): Promise<Department[]> {
    const departments = await this.prisma.department.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    return departments.map((d) => DepartmentMapper.toDomain(d));
  }

  async findById(id: string): Promise<Department | null> {
    const department = await this.prisma.department.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return department ? DepartmentMapper.toDomain(department) : null;
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.department.count({
      where: {
        id,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async save(department: Department): Promise<Department> {
    const upsertArgs = DepartmentMapper.toUpsertArgs(department);
    const savedDepartment = await this.prisma.department.upsert(upsertArgs);
    return DepartmentMapper.toDomain(savedDepartment);
  }

  async saveMany(departments: Department[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      for (const department of departments) {
        const upsertArgs = DepartmentMapper.toUpsertArgs(department);
        await tx.department.upsert(upsertArgs);
      }
    });
  }

  async delete(ids: string[]): Promise<void> {
    await this.prisma.department.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async hardDelete(ids: string[]): Promise<void> {
    await this.prisma.department.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async restore(ids: string[]): Promise<void> {
    await this.prisma.department.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
