import { UuidValueObject } from "../../../shared/value-object/uuid-value-object.vo";
import { UserDomain } from "../users/users.domain";
import { AccountBalanceDTO } from "./dto";

export class AccountBalanceDomain {
  private readonly balanceId: UuidValueObject;
  private readonly user: UserDomain | null;
  private balance: number;
  private readonly balanceDate: Date;
  private readonly description: string | null;

  private constructor(params: AccountBalanceDTO) {
    this.balanceId = params.balanceId ? new UuidValueObject(params.balanceId) : new UuidValueObject();
    this.user = params.user;
    this.balance = params.balance;
    this.balanceDate = params.balanceDate;
    this.description = params.description;
  }

  public static create(params: AccountBalanceDTO): AccountBalanceDomain {
    return new AccountBalanceDomain(params);
  }

  getBalanceId(): string {
    return this.balanceId.getValue();
  }

  getUser(): UserDomain | null {
    return this.user;
  }

  getBalance(): number {
    return this.balance;
  }

  getBalanceDate(): Date {
    return this.balanceDate;
  }

  getDescription(): string | null {
    return this.description;
  }
}