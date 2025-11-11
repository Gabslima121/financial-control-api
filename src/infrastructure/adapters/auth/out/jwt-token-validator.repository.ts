import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { TokenValidatorPort } from '../../../../core/port/token-validator.port';
import { UnauthorizedException } from '../../../../shared/errors/custom.exception';

@Injectable()
export class JwtTokenValidatorRepository implements TokenValidatorPort {
  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
