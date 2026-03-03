import { AccountDomain } from "src/core/domain/account/account.domain";
import { AccountDomainDTO } from "src/core/domain/account/dto";
import { UserDomainAdapter } from "src/infrastructure/adapters/user/in/user.adapter";

export class AccountDomainAdapter {
    public static toDomain(props: AccountDomainDTO): AccountDomain {
        return AccountDomain.create(props);
    }

    public static toDTO(domain: AccountDomain): AccountDomainDTO {
        return {
            id: domain.getId(),
            userId: domain.getUserId(),
            user: domain.getUser() ? UserDomainAdapter.toDTO(domain.getUser()!) : null,
            name: domain.getName(),
            bankName: domain.getBankName(),
            initialBalance: domain.getInitialBalance(),
            createdAt: domain.getCreatedAt(),
        };
    }
}
