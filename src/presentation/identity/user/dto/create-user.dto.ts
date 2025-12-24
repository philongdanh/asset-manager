import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsUUID,
  ArrayMinSize,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  roleIds?: string[];
}
