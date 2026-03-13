import { Module } from '@nestjs/common';
import { PersonImpl } from 'src/infrastructure/adapters/person/out/person.impl';
import { PrismaProvider } from '../utils/providers/prisma.provider';
import { CreatePersonUseCase } from 'src/application/person/create-person.use-case';
import { PersonPort } from 'src/core/port/person.port';
import { PersonController } from './person.controller';
import { FindPersonById } from 'src/application/person/find-person-by-id.use-case';

@Module({
  providers: [
    PrismaProvider,
    {
      provide: 'PersonPort',
      useClass: PersonImpl,
    },
    {
      provide: CreatePersonUseCase,
      useFactory: (personPort: PersonPort) =>
        new CreatePersonUseCase(personPort),
      inject: ['PersonPort'],
    },
    {
      provide: FindPersonById,
      useFactory: (personPort: PersonPort) => new FindPersonById(personPort),
      inject: ['PersonPort'],
    },
  ],
  controllers: [PersonController],
  exports: [FindPersonById],
})
export class PersonModule {}
