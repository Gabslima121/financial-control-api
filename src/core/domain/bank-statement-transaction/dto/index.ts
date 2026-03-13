import { AccountDomainDTO } from 'src/core/domain/account/dto';

export interface BankStatementTransactionDomainDTO {
  id?: string;
  accountId: string;
  account?: AccountDomainDTO | null;
  fitId: string;
  amount: number;
  postedAt: Date;
  description: string | null;
  rawType: string | null;
  createdAt?: Date | null;
}
