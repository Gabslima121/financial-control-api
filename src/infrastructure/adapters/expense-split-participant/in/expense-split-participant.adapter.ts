import { ExpenseSplitParticipantDomainDTO } from 'src/core/domain/expense-split-participant/dto';
import { ExpenseSplitParticipantDomain } from 'src/core/domain/expense-split-participant/expense-split-participant.domain';

export class ExpenseSplitParticipantAdapter {
  public static toDomain(
    dto: ExpenseSplitParticipantDomainDTO,
  ): ExpenseSplitParticipantDomain {
    return ExpenseSplitParticipantDomain.create(dto);
  }

  public static toDTO(
    domain: ExpenseSplitParticipantDomain,
  ): ExpenseSplitParticipantDomainDTO {
    return {
      id: domain.getId(),
      ruleId: domain.getRuleId() ?? undefined,
      personId: domain.getPersonId(),
      person: domain.getPerson() ?? undefined,
      fixedPercent: domain.getFixedPercent(),
      fixedAmount: domain.getFixedAmount(),
      createdAt: domain.getCreatedAt(),
    };
  }
}
