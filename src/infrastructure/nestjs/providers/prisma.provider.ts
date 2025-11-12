import { PrismaClient } from '@prisma/client';

export const PrismaProvider = {
  provide: PrismaClient,
  useFactory: () => {
    const prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    prisma.$on('query', (e) => {
      console.log('----------------------------');
      console.log('🧩 Prisma Query Executada:');
      console.log('Query:', e.query);
      console.log('Params:', e.params);
      console.log('Duration:', `${e.duration}ms`);
      console.log('----------------------------\n');
    });

    return prisma;
  },
};
