import { Expose } from 'class-transformer';
import { IsArray, IsUUID } from 'class-validator';

export class DeleteRolesRequest {
  @Expose()
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}
