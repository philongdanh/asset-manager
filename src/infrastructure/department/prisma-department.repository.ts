import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { DepartmentMapper } from './department.mapper';
import { Department, IDepartmentRepository } from 'src/domain/departmenet';

@Injectable()
export class PrismaDepartmentRepository implements IDepartmentRepository {
  constructor(private prisma: PrismaService) {}

  async find(): Promise<Department[]> {
    const departments = await this.prisma.department.findMany();
    const mappedDepartments = departments.map((department) =>
      DepartmentMapper.toDomain(department),
    );
    return mappedDepartments;
  }

  async findById(departmentId: string): Promise<Department | null> {
    const department = await this.prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });
    return department ? DepartmentMapper.toDomain(department) : null;
  }

  async save(department: Department): Promise<Department> {
    const persistDepartment = await this.prisma.department.upsert({
      where: {
        id: department.id,
      },
      update: DepartmentMapper.toPersistence(department).data,
      create: DepartmentMapper.toPersistence(department).data,
    });
    if (!persistDepartment) {
      throw new Error('Failed to save department.');
    }
    return DepartmentMapper.toDomain(persistDepartment);
  }
}
