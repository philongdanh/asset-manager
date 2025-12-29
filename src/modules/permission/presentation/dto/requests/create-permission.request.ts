import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionRequest {
    @Expose()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Expose()
    @IsOptional()
    @IsString()
    description: string;
}
