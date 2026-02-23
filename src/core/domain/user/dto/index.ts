export interface UserDomainDTO {
    userId?: string;
    userName: string;
    userDocument: string;
    email: string;
    password: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    isActive: boolean;
}