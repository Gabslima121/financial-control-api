import { PrismaClient } from "@prisma/client";
import { PersonDomain } from "src/core/domain/person/person.domain";
import { PersonPort } from "src/core/port/person.port";
import { PersonAdapter } from "../in/person.adapter";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PersonImpl implements PersonPort {
    constructor(private readonly prisma: PrismaClient) {}

    async createPerson(personInformation: PersonDomain): Promise<void> {
        await this.prisma.person.create({
            data: PersonAdapter.toDTO(personInformation),
        });
    }

    async listPerson(): Promise<PersonDomain[]> {
        const persons = await this.prisma.person.findMany();
        return persons.map((person) => PersonAdapter.toDomain(person));
    }
}