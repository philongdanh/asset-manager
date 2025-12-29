import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateAssetCategoryRequest {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @IsUUID('4')
    @IsOptional()
    parentId: string | null;
}
