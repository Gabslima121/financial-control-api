import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import { ExpenseSplitRuleDomainDTO, ExpenseSplitType } from './dto';
import { ExpenseSplitParticipantDomain } from 'src/core/domain/expense-split-participant/expense-split-participant.domain';

export class ExpenseSplitRuleDomain {
  private readonly id: UuidValueObject;
  private readonly accountId: UuidValueObject;
  private readonly name: string;
  private readonly type: ExpenseSplitType;
  private readonly recurrenceGroupId: UuidValueObject | null;
  private readonly transactionId: UuidValueObject | null;
  private readonly isActive: boolean;
  private readonly participants: ExpenseSplitParticipantDomain[];
  private readonly createdAt: Date | null;
  private updatedAt: Date | null;

  private constructor(props: ExpenseSplitRuleDomainDTO) {
    this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
    this.accountId = new UuidValueObject(props.accountId);
    this.name = props.name;
    this.type = props.type;
    this.recurrenceGroupId = props.recurrenceGroupId
      ? new UuidValueObject(props.recurrenceGroupId)
      : null;
    this.transactionId = props.transactionId
      ? new UuidValueObject(props.transactionId)
      : null;
    this.isActive = props.isActive ?? true;
    this.participants = (props.participants ?? []).map((p) =>
      ExpenseSplitParticipantDomain.create({
        ...p,
        ruleId: props.id ?? undefined,
      }),
    );
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public static create(
    props: ExpenseSplitRuleDomainDTO,
  ): ExpenseSplitRuleDomain {
    return new ExpenseSplitRuleDomain(props);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getAccountId(): string {
    return this.accountId.getValue();
  }

  public getName(): string {
    return this.name;
  }

  public getType(): ExpenseSplitType {
    return this.type;
  }

  public getRecurrenceGroupId(): string | null {
    return this.recurrenceGroupId?.getValue() ?? null;
  }

  public getTransactionId(): string | null {
    return this.transactionId?.getValue() ?? null;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getParticipants(): ExpenseSplitParticipantDomain[] {
    return this.participants;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | null {
    return this.updatedAt;
  }
}
