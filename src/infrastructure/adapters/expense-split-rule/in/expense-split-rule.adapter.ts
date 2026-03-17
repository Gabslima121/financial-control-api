import { ExpenseSplitRuleDomainDTO } from 'src/core/domain/expense-split-rule/dto';
import { ExpenseSplitRuleDomain } from 'src/core/domain/expense-split-rule/expense-split-rule.domain';
import { ExpenseSplitParticipantAdapter } from 'src/infrastructure/adapters/expense-split-participant/in/expense-split-participant.adapter';

export class ExpenseSplitRuleAdapter {
  public static toDomain(
    dto: ExpenseSplitRuleDomainDTO,
  ): ExpenseSplitRuleDomain {
    return ExpenseSplitRuleDomain.create(dto);
  }

  public static toDTO(
    domain: ExpenseSplitRuleDomain,
  ): ExpenseSplitRuleDomainDTO {
    return {
      id: domain.getId(),
      accountId: domain.getAccountId(),
      name: domain.getName(),
      type: domain.getType(),
      recurrenceGroupId: domain.getRecurrenceGroupId(),
      transactionId: domain.getTransactionId(),
      isActive: domain.getIsActive(),
      participants: domain
        .getParticipants()
        .map((p) => ExpenseSplitParticipantAdapter.toDTO(p)),
      createdAt: domain.getCreatedAt(),
      updatedAt: domain.getUpdatedAt(),
    };
  }
}
