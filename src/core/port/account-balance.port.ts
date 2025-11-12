import { AccountBalanceDomain } from "../domain/account-balance/account-balance.domain";

export interface AccountBalancePort {
  createAccountBalance(amout: number, userId: string): Promise<AccountBalanceDomain>;
  findLatestAccountBalance(userId: string): Promise<AccountBalanceDomain | null>;
}