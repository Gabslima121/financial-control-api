import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserUseCase } from '../../../application/user/create-user.usecase';
import { UserPort } from '../../../core/port/user.port';
import { PrismaUserRepository } from '../../adapters/user/out/user.repository.adapter';
import { UserController } from '../controllers/user.controller';
import { PrismaProvider } from '../providers/prisma.provider';

@Module({
  providers: [
    PrismaProvider,
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
  ],
  controllers: [UserController],
  exports: ['UserPort'],
})
export class UsersModule {}
