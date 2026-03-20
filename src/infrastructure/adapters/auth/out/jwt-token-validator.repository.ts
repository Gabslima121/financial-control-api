import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { TokenValidatorPort } from '../../../../core/port/token-validator.port';
import { UnauthorizedException } from '../../../../shared/errors/custom.exception';

@Injectable()
export class JwtTokenValidatorRepository implements TokenValidatorPort {
  createToken(payload: any): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    const signPayload = this.normalizePayload(payload);
    const options =
      typeof signPayload === 'string' || Buffer.isBuffer(signPayload)
        ? {}
        : { expiresIn: '1d' };
    return Promise.resolve(jwt.sign(signPayload, secret, options));
  }

  validateToken(token: string): Promise<any> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
      return Promise.resolve(jwt.verify(token, secret));
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  createRefreshToken(payload: any): Promise<string> {
    const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    const signPayload = this.normalizePayload(payload);
    const options =
      typeof signPayload === 'string' || Buffer.isBuffer(signPayload)
        ? {}
        : { expiresIn: '7d' };
    return Promise.resolve(jwt.sign(signPayload, secret + '_refresh', options));
  }

  validateRefreshToken(token: string): Promise<any> {
    const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
      return Promise.resolve(jwt.verify(token, secret + '_refresh'));
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  private normalizePayload(payload: any): string | object | Buffer {
    if (typeof payload === 'string' || Buffer.isBuffer(payload)) {
      return payload;
    }
    if (typeof payload === 'object' && payload !== null) {
      return payload as object;
    }
    return {};
  }
}
