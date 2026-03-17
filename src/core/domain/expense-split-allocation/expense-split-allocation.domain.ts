import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { ExpenseSplitAllocationDomainDTO } from './dto';

export class ExpenseSplitAllocationDomain {
  private readonly id: UuidValueObject;
  private readonly transactionId: UuidValueObject;
  private readonly personId: UuidValueObject;
  private readonly person: PersonDomain | null;
  private readonly amount: number;
  private readonly createdAt: Date | null;

  private constructor(props: ExpenseSplitAllocationDomainDTO) {
    this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
    this.transactionId = new UuidValueObject(props.transactionId);

    const resolvedPersonId = props.personId ?? props.person?.getId();
    if (!resolvedPersonId) {
      throw new Error('personId is required');
    }

    this.personId = new UuidValueObject(resolvedPersonId);
    this.person = props.person ?? null;
    this.amount = props.amount;
    this.createdAt = props.createdAt ?? new Date();
  }

  public static create(
    props: ExpenseSplitAllocationDomainDTO,
  ): ExpenseSplitAllocationDomain {
    return new ExpenseSplitAllocationDomain(props);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getTransactionId(): string {
    return this.transactionId.getValue();
  }

  public getPersonId(): string {
    return this.personId.getValue();
  }

  public getPerson(): PersonDomain | null {
    return this.person;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }
}
