import { UserDomain } from "../../user/user.domain";

export interface AccountBalanceDomainDTO {
    balanceId: string | null;
    user: UserDomain | null;
    balance: number;
    balanceDate: Date;
    notes: string | null;
}