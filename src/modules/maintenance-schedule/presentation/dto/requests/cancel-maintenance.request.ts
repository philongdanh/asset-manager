import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelMaintenanceRequest {
  @Expose()
  @IsString()
  @IsNotEmpty()
  reason: string;
}
