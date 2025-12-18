import {
  Prisma,
  Department as PrismaDepartment,
} from 'generated/prisma/client';
import { Department } from 'src/domain/modules/department';

export class DepartmentMapper {
  static toDomain(prismaDepartment: PrismaDepartment): Department {
    return new Department(
      prismaDepartment.id,
      prismaDepartment.organizationId,
      prismaDepartment.name,
      prismaDepartment.parentId,
    );
  }

  static toPersistence(department: Department): Prisma.DepartmentCreateArgs {
    return {
      data: {
        id: department.id,
        organizationId: department.organizationId,
        name: department.name,
        parentId: department.parentId,
      },
      include: {
        organization: true,
        parent: true,
        users: true,
        currentAssets: true,
        fromTransfers: true,
        budgetPlans: true,
      },
    };
  }
}
