import { PersonDomain } from "../domain/person/person.domain";

export interface PersonPort {
    createPerson(personInformation: PersonDomain): Promise<void>;
    listPerson(): Promise<PersonDomain[]>;
}