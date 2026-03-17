import { ExpenseSplitParticipantDomainDTO } from 'src/core/domain/expense-split-participant/dto';

export enum ExpenseSplitType {
  PROPORTIONAL_INCOME = 'proportional_income',
  FIXED_PERCENT = 'fixed_percent',
  FIXED_AMOUNT = 'fixed_amount',
}

export interface ExpenseSplitRuleDomainDTO {
  id?: string;
  accountId: string;
  name: string;
  type: ExpenseSplitType;
  recurrenceGroupId?: string | null;
  transactionId?: string | null;
  isActive?: boolean;
  participants?: ExpenseSplitParticipantDomainDTO[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
