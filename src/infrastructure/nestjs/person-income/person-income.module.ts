import { Module } from "@nestjs/common";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { PersonIncomeImpl } from "src/infrastructure/adapters/person-income/out/person-income.impl";
import { CreatePersonIncomeUseCase } from "src/application/person-income/create-person-income.use-case";
import { PersonIncomePort } from "src/core/port/person-income.port";
import { PersonIncomeController } from "./person-income.controller";
import { PersonModule } from "../person/person.module";
import { FindPersonById } from "src/application/person/find-person-by-id.use-case";
import { GetPersonIncomeByPersonIdUseCase } from "src/application/person-income/get-person-income-by-person-id.use-case";
import { GetPersonIncomeByIdUseCase } from "src/application/person-income/get-person-income-by-id.use-case";

@Module({
    imports: [PersonModule],
    providers: [
        PrismaProvider,
        {
            provide: 'PersonIncomePort',
            useClass: PersonIncomeImpl,
        },
        {
            provide: CreatePersonIncomeUseCase,
            useFactory: (
                personIncomePort: PersonIncomePort,
                findPersonById: FindPersonById
            ) => new CreatePersonIncomeUseCase(
                personIncomePort,
                findPersonById
            ),
            inject: [
                'PersonIncomePort',
                FindPersonById
            ],
        },
        {
            provide: GetPersonIncomeByPersonIdUseCase,
            useFactory: (
                personIncomePort: PersonIncomePort,
                findPersonById: FindPersonById
            ) => new GetPersonIncomeByPersonIdUseCase(
                personIncomePort,
                findPersonById
            ),
            inject: [
                'PersonIncomePort',
                FindPersonById
            ],
        },
        {
            provide: GetPersonIncomeByIdUseCase,
            useFactory: (
                personIncomePort: PersonIncomePort,
            ) => new GetPersonIncomeByIdUseCase(
                personIncomePort
            ),
            inject: [
                'PersonIncomePort',
            ],
        },
    ],
    controllers: [PersonIncomeController],
    exports: [
        GetPersonIncomeByPersonIdUseCase,
        GetPersonIncomeByIdUseCase,
    ],
})
export class PersonIncomeModule {}