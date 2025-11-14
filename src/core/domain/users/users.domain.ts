import { CnpjValueObject } from '../../../shared/value-object/cnpj.vo';
import { CpfValueObject } from '../../../shared/value-object/cpf.vo';
import { UuidValueObject } from '../../../shared/value-object/uuid-value-object.vo';
import { UserDomainDTO } from './dto';

export class UserDomain {
  private readonly userId: UuidValueObject;
  private readonly userName: string;
  private readonly userDocument: CnpjValueObject | CpfValueObject;
  private email: string;
  private readonly password: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private isActive: boolean;

  private constructor(params: UserDomainDTO) {
    const isCnpj = CnpjValueObject.isValid(params.userDocument);

    this.userId = params.userId
      ? new UuidValueObject(params.userId)
      : new UuidValueObject();
    this.userName = params.userName;
    this.userDocument = isCnpj
      ? new CnpjValueObject(params.userDocument)
      : new CpfValueObject(params.userDocument);
    this.password = params.password;
    this.email = params.email;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isActive = params.isActive;
  }

  static create(params: UserDomainDTO): UserDomain {
    return new UserDomain(params);
  }

  getUserId(): UuidValueObject {
    return this.userId;
  }

  getUserName(): string {
    return this.userName;
  }

  getUserDocument(): CnpjValueObject | CpfValueObject {
    return this.userDocument;
  }

  getEmail(): string {
    return this.email;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getPassword(): string {
    return this.password;
  }

  updateEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  activateUser(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  inactiveUser(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
