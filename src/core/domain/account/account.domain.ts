import { UuidValueObject } from "src/shared/value-object/uuid-value-object.vo";
import { AccountDomainDTO } from "./dto";

export class AccountDomain {
    private readonly id: UuidValueObject;
    private readonly userId: UuidValueObject;
    private readonly name: string;
    private readonly bankName: string | null;
    private readonly initialBalance: number;
    private readonly createdAt: Date | null;

    private constructor(props: AccountDomainDTO) {
        this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
        this.userId = new UuidValueObject(props.userId);
        this.name = props.name;
        this.bankName = props.bankName;
        this.initialBalance = props.initialBalance;
        this.createdAt = props.createdAt || new Date();
    }

    public static create(props: AccountDomainDTO): AccountDomain {
        return new AccountDomain(props);
    }

    public getId(): string {
        return this.id.getValue();
    }

    public getUserId(): string {
        return this.userId.getValue();
    }

    public getName(): string {
        return this.name;
    }

    public getBankName(): string | null {
        return this.bankName;
    }

    public getInitialBalance(): number {
        return this.initialBalance;
    }

    public getCreatedAt(): Date | null {
        return this.createdAt;
    }
}
