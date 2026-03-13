import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import { AccountDomainDTO } from './dto';
import { UserDomain } from '../user/user.domain';

export class AccountDomain {
  private readonly id: UuidValueObject;
  private readonly user: UserDomain | null;
  private readonly name: string;
  private readonly bankName: string | null;
  private readonly initialBalance: number;
  private readonly createdAt: Date | null;

  private constructor(props: AccountDomainDTO) {
    this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
    this.user = props.user ? props.user : null;
    this.name = props.name;
    this.bankName = props.bankName;
    this.initialBalance = props.initialBalance;
    this.createdAt = props.createdAt || new Date();
  }

  public static create(props: AccountDomainDTO): AccountDomain {
    return new AccountDomain(props);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getUser(): UserDomain | null {
    return this.user;
  }

  public getName(): string {
    return this.name;
  }

  public getBankName(): string | null {
    return this.bankName;
  }

  public getInitialBalance(): number {
    return this.initialBalance;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }
}
