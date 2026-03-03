import { UserDomainDTO } from "src/core/domain/user/dto";
import { UserDomain } from "../../user/user.domain";

export interface AccountDomainDTO {
    id?: string;
    user?: UserDomain | null;
    name: string;
    bankName: string | null;
    initialBalance: number;
    createdAt?: Date | null;
}
