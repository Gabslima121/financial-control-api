import { AccountBalanceDomain } from "../domain/account-balance/account-balance.domain";

export interface AccountBalancePort {
    createAccountBalance(params: AccountBalanceDomain): Promise<void>;
    getLatestAccountBalance(userId: string): Promise<AccountBalanceDomain>;
}