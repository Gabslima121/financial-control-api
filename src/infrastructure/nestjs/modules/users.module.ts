import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserUseCase } from '../../../application/user/create-user.usecase';
import { LoginUserUseCase } from '../../../application/user/login-user.usecase';
import { TokenValidatorPort } from '../../../core/port/token-validator.port';
import { UserPort } from '../../../core/port/user.port';
import { PrismaUserRepository } from '../../adapters/user/out/user.repository.adapter';
import { UserController } from '../controllers/user.controller';
import { PrismaProvider } from '../providers/prisma.provider';
import { JwtTokenValidatorRepository } from '../../adapters/auth/out/jwt-token-validator.repository';

@Module({
  providers: [
    PrismaProvider,
    {
      provide: 'TokenValidatorPort',
      useClass: JwtTokenValidatorRepository,
    },
    {
      provide: 'UserPort',
      useFactory: (prisma: PrismaClient) => new PrismaUserRepository(prisma),
      inject: [PrismaClient],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userPort: UserPort) => new CreateUserUseCase(userPort),
      inject: ['UserPort'],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userPort: UserPort, tokenValidatorPort: TokenValidatorPort) => new LoginUserUseCase(userPort, tokenValidatorPort),
      inject: ['UserPort', 'TokenValidatorPort'],
    }
  ],
  controllers: [UserController],
  exports: ['UserPort'],
})
export class UsersModule {}
