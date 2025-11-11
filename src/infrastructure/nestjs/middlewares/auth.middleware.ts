import { Inject, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenValidatorPort } from '../../../core/port/token-validator.port';
import { UnauthorizedException } from '../../../shared/errors/custom.exception';

export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject('TokenValidatorPort')
    private readonly tokenValidator: TokenValidatorPort,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'] || req.headers['Authorization'];

    if (!token) throw new UnauthorizedException('No token provided.');

    const payload = await this.tokenValidator.validateToken(token as string);

    if (!payload) throw new UnauthorizedException('Invalid Token');

    req.user = payload;

    next();
  }
}
