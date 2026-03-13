import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import { PersonDomainDTO } from './dto';

export class PersonDomain {
  private readonly id: UuidValueObject;
  private readonly name: string;
  private readonly email: string;

  private constructor(params: PersonDomainDTO) {
    this.id = params.id
      ? new UuidValueObject(params.id)
      : new UuidValueObject();
    this.name = params.name;
    this.email = params.email;
  }

  public static create(params: PersonDomainDTO): PersonDomain {
    return new PersonDomain(params);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }
}
