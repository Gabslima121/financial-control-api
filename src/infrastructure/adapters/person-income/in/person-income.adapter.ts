import { PersonIncomeDomainDTO } from 'src/core/domain/person-income/dto';
import { PersonIncomeDomain } from 'src/core/domain/person-income/person-income.domain';

export class PersonIncomeAdapter {
  public static toDomain(dto: PersonIncomeDomainDTO): PersonIncomeDomain {
    return PersonIncomeDomain.create(dto);
  }

  public static toDto(domain: PersonIncomeDomain): PersonIncomeDomainDTO {
    return {
      id: domain.getId(),
      person: domain.getPerson(),
      amount: domain.getAmount(),
      frequency: domain.getFrequency(),
      createdAt: domain.getCreatedAt()!,
    };
  }
}
