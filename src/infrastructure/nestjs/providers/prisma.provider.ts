import { PrismaClient } from '@prisma/client';

export const PrismaProvider = {
  provide: PrismaClient,
  useFactory: () => {
    return new PrismaClient();
  },
};