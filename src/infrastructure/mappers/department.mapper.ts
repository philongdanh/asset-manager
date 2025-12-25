import {
  Prisma,
  Department as PrismaDepartment,
} from 'generated/prisma/client';
import { Department } from 'src/domain/identity/department';

export class DepartmentMapper {
  static toDomain(prismaDepartment: PrismaDepartment): Department {
    return Department.builder(
      prismaDepartment.id,
      prismaDepartment.organizationId,
      prismaDepartment.name,
    )
      .withParent(prismaDepartment.parentId)
      .withTimestamps(
        prismaDepartment.createdAt,
        prismaDepartment.updatedAt,
        prismaDepartment.deletedAt,
      )
      .build();
  }

  static toPersistence(department: Department): Prisma.DepartmentCreateInput {
    return {
      id: department.id,
      name: department.name,
      organization: {
        connect: {
          id: department.organizationId,
        },
      },
      parent: department.parentId
        ? {
            connect: {
              id: department.parentId,
            },
          }
        : undefined,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      deletedAt: department.deletedAt,
    };
  }

  static toUpdatePersistence(
    department: Department,
  ): Prisma.DepartmentUpdateInput {
    return {
      id: department.id,
      name: department.name,
      organization: {
        connect: {
          id: department.organizationId,
        },
      },
      parent: department.parentId
        ? {
            connect: {
              id: department.parentId,
            },
          }
        : undefined,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      deletedAt: department.deletedAt,
    };
  }

  static toUpsertArgs(department: Department): Prisma.DepartmentUpsertArgs {
    return {
      where: { id: department.id },
      create: this.toPersistence(department),
      update: this.toUpdatePersistence(department),
    };
  }
}
