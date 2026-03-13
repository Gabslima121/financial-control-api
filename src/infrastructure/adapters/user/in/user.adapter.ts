import { UserDomainDTO } from 'src/core/domain/user/dto';
import { UserDomain } from 'src/core/domain/user/user.domain';

export class UserDomainAdapter {
  public static toDomain(props: UserDomainDTO): UserDomain {
    return UserDomain.create(props);
  }

  public static toDTO(domain: UserDomain): UserDomainDTO {
    return {
      id: domain.getId(),
      name: domain.getName(),
      document: domain.getDocument(),
      email: domain.getEmail(),
      createdAt: domain.getCreatedAt(),
      updatedAt: domain.getUpdatedAt(),
      isActive: domain.getIsActive(),
      password: domain.getPassword(),
    };
  }
}
