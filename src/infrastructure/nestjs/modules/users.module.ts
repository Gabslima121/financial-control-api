import { Module } from '@nestjs/common';
import { PrismaUserRepository } from '../../adapters/user/out/user.repository.adapter';
import { PrismaProvider } from '../providers/prisma.provider';

@Module({
  providers: [
    PrismaProvider,
    {
      provide: 'UserPort',
      useClass: PrismaUserRepository,
    },
  ],
  exports: ['UserPort'],
})
export class UsersModule {}