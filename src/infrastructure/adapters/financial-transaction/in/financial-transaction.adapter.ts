import { FinancialTransactionDomain } from 'src/core/domain/financial-transaction/financial-transaction.domain';
import { FinancialTransactionDomainDTO } from 'src/core/domain/financial-transaction/dto';
import { BankStatementTransactionAdapter } from 'src/infrastructure/adapters/bank-statement-transaction/in/bank-statement-transaction.adapter';

export class FinancialTransactionAdapter {
  public static toDomain(
    props: FinancialTransactionDomainDTO,
  ): FinancialTransactionDomain {
    return FinancialTransactionDomain.create(props);
  }

  public static toDTO(
    domain: FinancialTransactionDomain,
  ): FinancialTransactionDomainDTO {
    return {
      id: domain.getId(),
      account: domain.getAccount() ? domain.getAccount()! : null,
      type: domain.getType(),
      status: domain.getStatus(),
      amount: domain.getAmount(),
      description: domain.getDescription(),
      paymentMethod: domain.getPaymentMethod(),
      dueDate: domain.getDueDate(),
      paidAt: domain.getPaidAt(),
      installments: domain.getInstallments(),
      installment: domain.getInstallment(),
      bankStatement: domain.getBankStatement()
        ? BankStatementTransactionAdapter.toDTO(domain.getBankStatement()!)
        : null,
      recurrenceGroupId: domain.getRecurrenceGroupId(),
      recurrenceFrequency: domain.getRecurrenceFrequency(),
      recurrenceInterval: domain.getRecurrenceInterval(),
      recurrenceDayOfMonth: domain.getRecurrenceDayOfMonth(),
      createdAt: domain.getCreatedAt(),
      updatedAt: domain.getUpdatedAt(),
    };
  }
}
