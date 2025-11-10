import { UserDomain } from "../../users/users.domain";

export interface PaymentDestinationDomainDTO {
  paymentDestinationId: string;
  user?: UserDomain | null;
  companyName: string;
  companyDocument: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}