import { PersonDomain } from 'src/core/domain/person/person.domain';

export interface ExpenseSplitAllocationDomainDTO {
  id?: string;
  transactionId: string;
  personId?: string;
  person?: PersonDomain;
  amount: number;
  createdAt?: Date | null;
}
