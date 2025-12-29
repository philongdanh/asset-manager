import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @Expose({ name: 'refresh_token' })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
