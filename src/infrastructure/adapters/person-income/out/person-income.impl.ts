import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { RecurrenceFrequency } from "src/core/domain/financial-transaction/dto";
import { PersonIncomeDomain } from "src/core/domain/person-income/person-income.domain";
import { PersonIncomePort } from "src/core/port/person-income.port";

@Injectable()
export class PersonIncomeImpl implements PersonIncomePort {
    constructor(
        private readonly prisma: PrismaClient,
    ) {}

    async createPersonIncome(personIncome: PersonIncomeDomain): Promise<void> {
        await this.prisma.personIncome.create({
            data: {
                personId: personIncome.getPerson().getId(),
                amount: personIncome.getAmount(),
                frequency: personIncome.getFrequency(),
            },
        });
    }

    async getIncomeByPersonId(personId: string): Promise<PersonIncomeDomain | null> {
        const personIncome = await this.prisma.personIncome.findUnique({
            where: {
                personId,
            },
        });

        if (!personIncome) {
            return null;
        }

        return PersonIncomeDomain.create({
            id: personIncome.id,
            amount: Number(personIncome.amount),
            frequency: personIncome.frequency as RecurrenceFrequency,
            createdAt: personIncome.createdAt,
        });
    }

    async getIncomeById(incomeId: string): Promise<PersonIncomeDomain | null> {
        const personIncome = await this.prisma.personIncome.findUnique({
            where: {
                id: incomeId,
            },
        });

        if (!personIncome) {
            return null;
        }

        return PersonIncomeDomain.create({
            id: personIncome.id,
            amount: Number(personIncome.amount),
            frequency: personIncome.frequency as RecurrenceFrequency,
            createdAt: personIncome.createdAt,
        });
    }
}