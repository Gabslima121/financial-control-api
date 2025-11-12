import { AccountBalanceDomain } from "../../../../core/domain/account-balance/account-balance.domain";
import { AccountBalanceDTO } from "../../../../core/domain/account-balance/dto";

export class AccountBalanceDomainAdapter {
  public static toDomain(params: AccountBalanceDTO): AccountBalanceDomain {
    return AccountBalanceDomain.create(params);
  }

  public static toDTO(params: AccountBalanceDomain): AccountBalanceDTO {
    return {
      balanceId: params.getBalanceId(),
      user: params.getUser(),
      balance: params.getBalance(),
      balanceDate: params.getBalanceDate(),
      description: params.getDescription(),
    };
  }
}