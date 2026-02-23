import { AccountBalanceDomain } from "src/core/domain/account-balance/account-balance.domain";
import { AccountBalanceDomainDTO } from "src/core/domain/account-balance/dto";

export class AccountBalanceAdapter {
    public static toDomain(dto: AccountBalanceDomainDTO): AccountBalanceDomain {
        return AccountBalanceDomain.create(dto);
    }

    public static toDTO(domain: AccountBalanceDomain): AccountBalanceDomainDTO {
        return {
            balanceId: domain.getBalanceId(),
            user: domain.getUser(),
            balance: domain.getBalance(),
            balanceDate: domain.getBalanceDate(),
            notes: domain.getNotes(),
        };
    }
}