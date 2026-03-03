import { UserDomainDTO } from "src/core/domain/user/dto";

export interface AccountDomainDTO {
    id?: string;
    userId: string;
    user?: UserDomainDTO | null;
    name: string;
    bankName: string | null;
    initialBalance: number;
    createdAt?: Date | null;
}
