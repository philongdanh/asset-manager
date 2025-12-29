import { Expose } from 'class-transformer';

export class TokenResponse {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  constructor(partial: Partial<TokenResponse>) {
    Object.assign(this, partial);
  }
}
