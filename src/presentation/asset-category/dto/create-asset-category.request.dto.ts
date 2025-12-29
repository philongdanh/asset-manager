import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAssetCategoryRequest {
    @Expose({ name: 'organization_id' })
    @IsUUID('4')
    @IsNotEmpty()
    organizationId: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    code: string;

    @Expose({ name: 'category_name' })
    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @Expose({ name: 'parent_id' })
    @IsUUID('4')
    @IsOptional()
    parentId: string | null;
}
