import { CnpjValueObject } from "../../shared/value-object/cnpj.vo";
import { CpfValueObject } from "../../shared/value-object/cpf.vo";
import { UuidValueObject } from "../../shared/value-object/uuid-value-object.vo";
import { UserDomain } from "../users/users.domain";
import { PaymentDestinationDomainDTO } from "./dto";

export class PaymentDestinationsDomain {
  private readonly paymentDestinationId: UuidValueObject;
  private readonly user?: UserDomain | null;
  private readonly companyName: string;
  private readonly companyDocument: CnpjValueObject | CpfValueObject;
  private description?: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;
  
  private constructor(params: PaymentDestinationDomainDTO) {
    const isCnpj = CnpjValueObject.isValid(params.companyDocument);

    this.paymentDestinationId = params.paymentDestinationId ? new UuidValueObject(params.paymentDestinationId) : new UuidValueObject();
    this.user = params.user;
    this.companyName = params.companyName;
    this.companyDocument = isCnpj ? new CnpjValueObject(params.companyDocument) : new CpfValueObject(params.companyDocument);
    this.description = params.description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(params: PaymentDestinationDomainDTO): PaymentDestinationsDomain {
    return new PaymentDestinationsDomain(params);
  }

  getPaymentDestinationId(): string {
    return this.paymentDestinationId.getValue();
  }

  getCompanyDocument(): string {
    return this.companyDocument.getValue();
  }

  getUser(): UserDomain | null {
    return this.user!;
  }

  getCompanyName(): string {
    return this.companyName;
  }

  getDescription(): string | null {
    return this.description!;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateDescription(description: string | null) {
    this.description = description;
    this.updatedAt = new Date();
  }
}