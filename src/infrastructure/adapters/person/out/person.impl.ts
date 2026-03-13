import { PrismaClient } from "@prisma/client";
import { PersonDomain } from "src/core/domain/person/person.domain";
import { PersonPort } from "src/core/port/person.port";
import { PersonAdapter } from "../in/person.adapter";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PersonImpl implements PersonPort {
    constructor(private readonly prisma: PrismaClient) {}
    
    async findPersonById(id: string): Promise<PersonDomain> {
        const person = await this.prisma.person.findUnique({
            where: {
                id,
            },
        });

        if (!person) {
            throw new Error('Person not found');
        }

        return PersonAdapter.toDomain({
            id: person.id,
            name: person.name,
            email: person.email,
        });
    }

    async createPerson(personInformation: PersonDomain): Promise<void> {
        await this.prisma.person.create({
            data: PersonAdapter.toDTO(personInformation),
        });
    }

    async listPeople(): Promise<PersonDomain[]> {
        const people = await this.prisma.person.findMany();
        return people.map((person) => PersonAdapter.toDomain(person));
    }
}