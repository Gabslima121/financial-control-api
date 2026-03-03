import { BankStatementTransactionDomain } from "../domain/bank-statement-transaction/bank-statement-transaction.domain";

export interface BankStatementTransactionPort {
    create(transaction: BankStatementTransactionDomain): Promise<void>;
    findByFitId(accountId: string, fitId: string): Promise<BankStatementTransactionDomain | null>;
    listByAccountId(accountId: string): Promise<BankStatementTransactionDomain[]>;
}
