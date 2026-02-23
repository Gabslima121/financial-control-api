import { UuidValueObject } from "src/shared/value-object/uuid-value-object.vo";
import { UserDomain } from "../user/user.domain";
import { AccountBalanceDomainDTO } from "./dto";

export class AccountBalanceDomain {
    private readonly balanceId: UuidValueObject;
    private readonly user: UserDomain | null;
    private readonly balanceDate: Date;
    private balance: number;
    private readonly notes: string;

    private constructor(params: AccountBalanceDomainDTO) {
        this.balanceId = params.balanceId ? new UuidValueObject(params.balanceId) : new UuidValueObject();
        this.user = params.user!;
        this.balance = params.balance;
        this.balanceDate = params.balanceDate || new Date();
        this.notes = params.notes;
    }

    public static create(params: AccountBalanceDomainDTO): AccountBalanceDomain {
        return new AccountBalanceDomain(params);
    }

    public getBalanceId(): string {
        return this.balanceId.getValue();
    }

    public getUser(): UserDomain | null{
        return this.user;
    }

    public getBalance(): number {
        return this.balance;
    }

    public getBalanceDate(): Date {
        return this.balanceDate;
    }

    public getNotes(): string {
        return this.notes;
    }

    public updateBalance(balance: number): void {
        this.balance = balance;
    }
}