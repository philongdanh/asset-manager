import { Type, Expose } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { AssetTransferStatus, AssetTransferType } from '../../../domain';

export class GetAssetTransfersRequest {
  @IsEnum(AssetTransferStatus)
  @IsOptional()
  status?: AssetTransferStatus;

  @Expose({ name: 'transfer_type' })
  @IsEnum(AssetTransferType)
  @IsOptional()
  transferType?: AssetTransferType;

  @Expose({ name: 'from_department_id' })
  @IsUUID('4')
  @IsOptional()
  fromDepartmentId?: string;

  @Expose({ name: 'to_department_id' })
  @IsUUID('4')
  @IsOptional()
  toDepartmentId?: string;

  @Expose({ name: 'from_user_id' })
  @IsUUID('4')
  @IsOptional()
  fromUserId?: string;

  @Expose({ name: 'to_user_id' })
  @IsUUID('4')
  @IsOptional()
  toUserId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
