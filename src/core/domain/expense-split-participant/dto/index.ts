import { PersonDomain } from 'src/core/domain/person/person.domain';

export interface ExpenseSplitParticipantDomainDTO {
  id?: string;
  ruleId?: string;
  personId?: string;
  person?: PersonDomain;
  fixedPercent?: number | null;
  fixedAmount?: number | null;
  createdAt?: Date | null;
}
