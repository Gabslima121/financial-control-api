import { AccountDomain } from '../domain/account/account.domain';

export interface AccountPort {
  createAccount(account: AccountDomain): Promise<void>;
  findById(id: string): Promise<AccountDomain | null>;
  listAccountsByUserId(userId: string): Promise<AccountDomain[]>;
  updateAccount(account: AccountDomain): Promise<void>;
  deleteAccount(id: string): Promise<void>;
}
