import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AssetDocumentType } from 'src/domain/asset-lifecycle/asset-document';

export class UploadAssetDocumentRequest {
    @Expose({ name: 'organization_id' })
    @IsUUID('4')
    @IsNotEmpty()
    organizationId: string;

    @Expose({ name: 'asset_id' })
    @IsUUID('4')
    @IsNotEmpty()
    assetId: string;

    @Expose({ name: 'document_name' })
    @IsString()
    @IsNotEmpty()
    documentName: string;

    @Expose({ name: 'file_path' })
    @IsString()
    @IsNotEmpty()
    filePath: string;

    @Expose({ name: 'file_type' })
    @IsString()
    @IsNotEmpty()
    fileType: string;

    @Expose({ name: 'document_type' })
    @IsEnum(AssetDocumentType)
    @IsNotEmpty()
    documentType: AssetDocumentType;

    @Expose()
    @IsString()
    @IsOptional()
    description?: string | null;
}
