import { ExpenseSplitAllocationDomainDTO } from 'src/core/domain/expense-split-allocation/dto';
import { ExpenseSplitAllocationDomain } from 'src/core/domain/expense-split-allocation/expense-split-allocation.domain';

export class ExpenseSplitAllocationAdapter {
  public static toDomain(
    dto: ExpenseSplitAllocationDomainDTO,
  ): ExpenseSplitAllocationDomain {
    return ExpenseSplitAllocationDomain.create(dto);
  }

  public static toDTO(
    domain: ExpenseSplitAllocationDomain,
  ): ExpenseSplitAllocationDomainDTO {
    return {
      id: domain.getId(),
      transactionId: domain.getTransactionId(),
      personId: domain.getPersonId(),
      person: domain.getPerson() ?? undefined,
      amount: domain.getAmount(),
      createdAt: domain.getCreatedAt(),
    };
  }
}
