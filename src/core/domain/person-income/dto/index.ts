import { RecurrenceFrequency } from "../../financial-transaction/dto";
import { PersonDomain } from "../../person/person.domain";

export interface PersonIncomeDomainDTO {
    id?: string;
    person?: PersonDomain;
    amount: number;
    frequency: RecurrenceFrequency;
    createdAt?: Date;
}