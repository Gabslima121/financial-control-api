import { Injectable } from "@nestjs/common";
import { PaymentMethod } from "src/core/domain/financial-transaction/dto";
import { AccountPort } from "src/core/port/account.port";
import { FinancialTransactionPort } from "src/core/port/financial-transaction.port";
import { FinancialTransactionAdapter } from "src/infrastructure/adapters/financial-transaction/in/financial-transaction.adapter";
import { CreateFinancialTransactionDTO } from "src/infrastructure/nestjs/financial-transaction/dto/create-financial-transaction.dto";
import { NotFoundException } from "src/shared/errors/custom.exception";

@Injectable()
export class CreateFinancialTransactionUseCase {
    constructor(
        private readonly financialTransactionPort: FinancialTransactionPort,
        private readonly accountPort: AccountPort,
    ) {}

    async execute(params: CreateFinancialTransactionDTO, accountId: string) {
        const account = await this.accountPort.findById(accountId);

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        const paymentMethod = params.paymentMethod as PaymentMethod;

        const financialTransactionDomain = FinancialTransactionAdapter.toDomain({
            amount: params.amount,
            type: params.type,
            status: params.status,
            description: params.description,
            paymentMethod,
            installments: 1,
            installment: 1,
            dueDate: params.dueDate,
            paidAt: params.paidAt,
            account,
        });

        await this.financialTransactionPort.create(financialTransactionDomain);
    }
}