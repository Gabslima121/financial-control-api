import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { ExpenseSplitParticipantDomainDTO } from './dto';

export class ExpenseSplitParticipantDomain {
  private readonly id: UuidValueObject;
  private readonly ruleId: UuidValueObject | null;
  private readonly personId: UuidValueObject;
  private readonly person: PersonDomain | null;
  private readonly fixedPercent: number | null;
  private readonly fixedAmount: number | null;
  private readonly createdAt: Date | null;

  private constructor(props: ExpenseSplitParticipantDomainDTO) {
    this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
    this.ruleId = props.ruleId ? new UuidValueObject(props.ruleId) : null;

    const resolvedPersonId = props.personId ?? props.person?.getId();
    if (!resolvedPersonId) {
      throw new Error('personId is required');
    }

    this.personId = new UuidValueObject(resolvedPersonId);
    this.person = props.person ?? null;
    this.fixedPercent = props.fixedPercent ?? null;
    this.fixedAmount = props.fixedAmount ?? null;
    this.createdAt = props.createdAt ?? new Date();
  }

  public static create(
    props: ExpenseSplitParticipantDomainDTO,
  ): ExpenseSplitParticipantDomain {
    return new ExpenseSplitParticipantDomain(props);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getRuleId(): string | null {
    return this.ruleId?.getValue() ?? null;
  }

  public getPersonId(): string {
    return this.personId.getValue();
  }

  public getPerson(): PersonDomain | null {
    return this.person;
  }

  public getFixedPercent(): number | null {
    return this.fixedPercent;
  }

  public getFixedAmount(): number | null {
    return this.fixedAmount;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }
}
