import { AccountDomain } from 'src/core/domain/account/account.domain';
import { AccountDomainDTO } from 'src/core/domain/account/dto';

export class AccountDomainAdapter {
  public static toDomain(props: AccountDomainDTO): AccountDomain {
    return AccountDomain.create(props);
  }

  public static toDTO(domain: AccountDomain): AccountDomainDTO {
    return {
      id: domain.getId(),
      user: domain.getUser() ? domain.getUser() : null,
      name: domain.getName(),
      bankName: domain.getBankName(),
      initialBalance: domain.getInitialBalance(),
      createdAt: domain.getCreatedAt(),
    };
  }
}
