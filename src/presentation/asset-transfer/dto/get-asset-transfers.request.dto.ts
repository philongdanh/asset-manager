import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import {
  AssetTransferStatus,
  AssetTransferType,
} from 'src/domain/asset-lifecycle/asset-transfer';

export class GetAssetTransfersRequest {
  @IsEnum(AssetTransferStatus)
  @IsOptional()
  status?: AssetTransferStatus;

  @IsEnum(AssetTransferType)
  @IsOptional()
  transferType?: AssetTransferType;

  @IsUUID('4')
  @IsOptional()
  fromDepartmentId?: string;

  @IsUUID('4')
  @IsOptional()
  toDepartmentId?: string;

  @IsUUID('4')
  @IsOptional()
  fromUserId?: string;

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
