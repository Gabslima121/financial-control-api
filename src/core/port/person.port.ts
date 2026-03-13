import { PersonDomain } from "../domain/person/person.domain";

export interface PersonPort {
    createPerson(personInformation: PersonDomain): Promise<void>;
    listPeople(): Promise<PersonDomain[]>;
    findPersonById(id: string): Promise<PersonDomain>;
}