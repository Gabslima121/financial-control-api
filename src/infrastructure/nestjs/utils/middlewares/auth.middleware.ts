import { Inject, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenValidatorPort } from '../../../../core/port/token-validator.port';
import { UnauthorizedException } from '../../../../shared/errors/custom.exception';
import { AuthenticatedUser } from '../types/express';

export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject('TokenValidatorPort')
    private readonly tokenValidator: TokenValidatorPort,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const headerValue = req.headers['authorization'];
    const token =
      typeof headerValue === 'string'
        ? headerValue
        : Array.isArray(headerValue)
          ? headerValue[0]
          : undefined;

    if (!token) throw new UnauthorizedException('No token provided.');

    const payload: unknown = await this.tokenValidator.validateToken(token);

    if (!payload) throw new UnauthorizedException('Invalid Token');

    if (typeof payload !== 'object' || payload === null) {
      throw new UnauthorizedException('Invalid Token');
    }

    const user = payload as Partial<AuthenticatedUser>;
    if (typeof user.id !== 'string' || typeof user.accountId !== 'string') {
      throw new UnauthorizedException('Invalid Token');
    }

    req.user = user as AuthenticatedUser;

    next();
  }
}
