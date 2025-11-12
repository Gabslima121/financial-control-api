import { UserDomain } from '../../users/users.domain';

export interface AccountBalanceDTO {
  balanceId: string;
  user?: UserDomain | null;
  balance: number;
  balanceDate: Date;
  description: string | null;
}
