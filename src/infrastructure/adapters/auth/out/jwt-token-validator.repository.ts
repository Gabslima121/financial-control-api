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

    const signPayload: string | object | Buffer =
      typeof payload === 'string' || Buffer.isBuffer(payload)
        ? payload
        : typeof payload === 'object' && payload !== null
          ? (payload as object)
          : {};

    return Promise.resolve(jwt.sign(signPayload, secret));
  }

  validateToken(token: string): Promise<any> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
      const decoded = jwt.verify(token, secret);

      return Promise.resolve(decoded);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
