import { Exclude, Expose } from 'class-transformer';
import { Department } from '../../../domain';

@Exclude()
export class DepartmentResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'parent_id' })
  parentId: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(dept: Department) {
    this.id = dept.id;
    this.name = dept.name;
    this.organizationId = dept.organizationId;
    this.parentId = dept.parentId;
    this.createdAt = dept.createdAt!;
    this.updatedAt = dept.updatedAt!;
  }
}
