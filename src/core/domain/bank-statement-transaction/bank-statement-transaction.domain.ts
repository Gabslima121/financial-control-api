import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import { BankStatementTransactionDomainDTO } from './dto';
import { AccountDomain } from '../account/account.domain';
import { AccountDomainAdapter } from 'src/infrastructure/adapters/account/in/account.adapter';

export class BankStatementTransactionDomain {
  private readonly id: UuidValueObject;
  private readonly accountId: UuidValueObject;
  private readonly account: AccountDomain | null;
  private readonly fitId: string;
  private readonly amount: number;
  private readonly postedAt: Date;
  private readonly description: string | null;
  private readonly rawType: string | null;
  private readonly createdAt: Date | null;

  private constructor(props: BankStatementTransactionDomainDTO) {
    this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
    this.accountId = new UuidValueObject(props.accountId);
    this.account = props.account
      ? AccountDomainAdapter.toDomain(props.account)
      : null;
    this.fitId = props.fitId;
    this.amount = props.amount;
    this.postedAt = props.postedAt;
    this.description = props.description;
    this.rawType = props.rawType;
    this.createdAt = props.createdAt || new Date();
  }

  public static create(
    props: BankStatementTransactionDomainDTO,
  ): BankStatementTransactionDomain {
    return new BankStatementTransactionDomain(props);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getAccountId(): string {
    return this.accountId.getValue();
  }

  public getAccount(): AccountDomain | null {
    return this.account;
  }

  public getFitId(): string {
    return this.fitId;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getPostedAt(): Date {
    return this.postedAt;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getRawType(): string | null {
    return this.rawType;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }
}
