import { UserDomainDTO } from "../../../../core/domain/users/dto";
import { UserDomain } from "../../../../core/domain/users/users.domain";

export class UserDomainAdapter {
  public static toDomain(dto: UserDomainDTO): UserDomain {
    return UserDomain.create(dto);
  }

  public static toDTO(domain: UserDomain): UserDomainDTO {
    return {
      userId: domain.getUserId().getValue(),
      userName: domain.getUserName(),
      userDocument: domain.getUserDocument().getValue(),
      email: domain.getEmail(),
      createdAt: domain.getCreatedAt(),
      updatedAt: domain.getUpdatedAt(),
      isActive: domain.getIsActive(),
    };
  }
}