import { TransactionDomainDTO } from "src/core/domain/transaction/dto";
import { TransactionDomain } from "src/core/domain/transaction/transaction.domain";

export class TransactionAdapter {
    public static toDomain(props: TransactionDomainDTO): TransactionDomain {
        return TransactionDomain.create(props);
    }

    public static toDTO(props: TransactionDomain): TransactionDomainDTO {
        return {
            transactionId: props.getTransactionId(),
            user: props.getUser(),
            type: props.getType(),
            amount: props.getAmount(),
            paymentMethod: props.getPaymentMethod(),
            installments: props.getInstallments(),
            currentInstallment: props.getCurrentInstallment(),
            description: props.getDescription(),
            transactionStatus: props.getTransactionStatus(),
            transactionDate: props.getTransactionDate(),
            dueDate: props.getDueDate(),
            paymentDate: props.getPaymentDate(),
            createdAt: props.getCreatedAt(),
            updatedAt: props.getUpdatedAt(),
        };
    }
}
