import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import { PersonDomain } from '../person/person.domain';
import { RecurrenceFrequency } from '../financial-transaction/dto';
import { PersonIncomeDomainDTO } from './dto';

export class PersonIncomeDomain {
  private readonly id: UuidValueObject;
  private readonly person: PersonDomain | null;
  private readonly amount: number;
  private readonly frequency: RecurrenceFrequency;
  private readonly createdAt: Date | null;

  private constructor(params: PersonIncomeDomainDTO) {
    this.id = params.id
      ? new UuidValueObject(params.id)
      : new UuidValueObject();
    this.person = params.person!;
    this.amount = params.amount;
    this.frequency = params.frequency;
    this.createdAt = params.createdAt ? new Date(params.createdAt) : null;
  }

  public static create(params: PersonIncomeDomainDTO): PersonIncomeDomain {
    return new PersonIncomeDomain(params);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getPerson(): PersonDomain {
    return this.person!;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getFrequency(): RecurrenceFrequency {
    return this.frequency;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }
}
