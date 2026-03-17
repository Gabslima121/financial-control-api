import { ExpenseSplitRuleDomain } from '../domain/expense-split-rule/expense-split-rule.domain';

export interface ExpenseSplitRulePort {
  create(rule: ExpenseSplitRuleDomain): Promise<void>;
  findById(id: string): Promise<ExpenseSplitRuleDomain | null>;
  listByAccountId(accountId: string): Promise<ExpenseSplitRuleDomain[]>;
  findActiveByRecurrenceGroupId(
    accountId: string,
    recurrenceGroupId: string,
  ): Promise<ExpenseSplitRuleDomain | null>;
  findActiveByTransactionId(
    accountId: string,
    transactionId: string,
  ): Promise<ExpenseSplitRuleDomain | null>;
}
