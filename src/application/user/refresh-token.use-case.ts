import { Injectable } from '@nestjs/common';
import { TokenValidatorPort } from 'src/core/port/token-validator.port';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly tokenValidatorPort: TokenValidatorPort) {}

  async execute(refreshToken: string) {
    const payload = await this.tokenValidatorPort.validateRefreshToken(refreshToken);

    const token = await this.tokenValidatorPort.createToken({
      id: payload.id,
      accountId: payload.accountId,
    });

    return { token };
  }
}
