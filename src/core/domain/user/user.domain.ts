import { CnpjValueObject } from 'src/shared/value-object/cnpj.vo';
import { CpfValueObject } from 'src/shared/value-object/cpf.vo';
import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import { UserDomainDTO } from './dto';

export class UserDomain {
  private readonly id: UuidValueObject;
  private readonly name: string;
  private readonly document: CpfValueObject | CnpjValueObject;
  private readonly email: string;
  private readonly password: string;
  private readonly createdAt: Date | null;
  private readonly updatedAt: Date | null;
  private isActive: boolean;

  private constructor(props: UserDomainDTO) {
    const document = this.createDocument(props.document);

    this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
    this.name = props.name;
    this.document = document;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.isActive = props.isActive;
  }

  public static create(props: UserDomainDTO): UserDomain {
    return new UserDomain(props);
  }

  private createDocument(document: string): CpfValueObject | CnpjValueObject {
    const isCnpj = document.length === 14;
    return isCnpj
      ? new CnpjValueObject(document)
      : new CpfValueObject(document);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getName(): string {
    return this.name;
  }

  public getDocument(): string {
    return this.document.getValue();
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public setActive(): void {
    this.isActive = true;
  }

  public setInactive(): void {
    this.isActive = false;
  }
}
