import { BankStatementTransactionDomain } from "src/core/domain/bank-statement-transaction/bank-statement-transaction.domain";
import { BankStatementTransactionDomainDTO } from "src/core/domain/bank-statement-transaction/dto";
import { AccountDomainAdapter } from "src/infrastructure/adapters/account/in/account.adapter";

export class BankStatementTransactionAdapter {
    public static toDomain(props: BankStatementTransactionDomainDTO): BankStatementTransactionDomain {
        return BankStatementTransactionDomain.create(props);
    }

    public static toDTO(domain: BankStatementTransactionDomain): BankStatementTransactionDomainDTO {
        return {
            id: domain.getId(),
            accountId: domain.getAccountId(),
            account: domain.getAccount() ? AccountDomainAdapter.toDTO(domain.getAccount()!) : null,
            fitId: domain.getFitId(),
            amount: domain.getAmount(),
            postedAt: domain.getPostedAt(),
            description: domain.getDescription(),
            rawType: domain.getRawType(),
            createdAt: domain.getCreatedAt(),
        };
    }
}
