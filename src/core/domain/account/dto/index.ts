export interface AccountDomainDTO {
    id?: string;
    userId: string;
    name: string;
    bankName: string | null;
    initialBalance: number;
    createdAt?: Date | null;
}
