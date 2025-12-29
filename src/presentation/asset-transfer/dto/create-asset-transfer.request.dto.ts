import { Expose, Type } from 'class-transformer';
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
  @Expose({ name: 'organization_id' })
  @IsUUID('4')
  @IsNotEmpty()
  organizationId: string; // Should be extracted from auth context

  @Expose({ name: 'asset_id' })
  @IsUUID('4')
  @IsNotEmpty()
  assetId: string;

  @Expose({ name: 'transfer_type' })
  @IsEnum(AssetTransferType)
  @IsNotEmpty()
  transferType: AssetTransferType;

  @Expose({ name: 'transfer_date' })
  @IsDate()
  @Type(() => Date)
  transferDate: Date;

  @Expose()
  @IsString()
  @IsOptional()
  reason: string | null;

  @Expose({ name: 'from_department_id' })
  @IsUUID('4')
  @IsOptional()
  fromDepartmentId: string | null;

  @Expose({ name: 'to_department_id' })
  @IsUUID('4')
  @IsOptional()
  toDepartmentId: string | null;

  @Expose({ name: 'from_user_id' })
  @IsUUID('4')
  @IsOptional()
  fromUserId: string | null;

  @Expose({ name: 'to_user_id' })
  @IsUUID('4')
  @IsOptional()
  toUserId: string | null;
}
