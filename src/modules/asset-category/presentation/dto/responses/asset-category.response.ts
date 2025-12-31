import { Exclude, Expose } from 'class-transformer';
import { AssetCategory } from '../../../domain';

@Exclude()
export class AssetCategoryResponse {
  @Expose()
  id: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose()
  code: string;

  @Expose({ name: 'category_name' })
  categoryName: string;

  @Expose({ name: 'parent_id' })
  parentId: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(entity: AssetCategory) {
    this.id = entity.id;
    this.organizationId = entity.organizationId;
    this.code = entity.code;
    this.categoryName = entity.categoryName;
    this.parentId = entity.parentId;
    this.createdAt = entity.createdAt!;
    this.updatedAt = entity.updatedAt!;
  }
}
