import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { AssetTransferType } from 'src/domain/asset-lifecycle/asset-transfer';

export class CreateAssetTransferRequest {
    @IsUUID('4')
    @IsNotEmpty()
    organizationId: string; // Should be extracted from auth context

    @IsUUID('4')
    @IsNotEmpty()
    assetId: string;

    @IsEnum(AssetTransferType)
    @IsNotEmpty()
    transferType: AssetTransferType;

    @IsDate()
    @Type(() => Date)
    transferDate: Date;

    @IsString()
    @IsOptional()
    reason: string | null;

    @IsUUID('4')
    @IsOptional()
    fromDepartmentId: string | null;

    @IsUUID('4')
    @IsOptional()
    toDepartmentId: string | null;

    @IsUUID('4')
    @IsOptional()
    fromUserId: string | null;

    @IsUUID('4')
    @IsOptional()
    toUserId: string | null;
}
