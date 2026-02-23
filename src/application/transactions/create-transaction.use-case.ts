import { PaymentMethod, TransactionStatus, TransactionType } from "@prisma/client";
import { TransactionDomainDTO } from "src/core/domain/transaction/dto";
import { TransactionAdapter } from "src/infrastructure/adapters/transactions/in/transactions.adapter";
import { TransactionsPort } from "src/core/port/transactions.port";
import { OfxParserPort } from "src/core/port/ofx-parser.port";

export class CreateTransactionUseCase {
    constructor(
        private readonly transactionsPort: TransactionsPort,
        private readonly ofxParserPort: OfxParserPort,
    ) {}

    async execute(ofxContent: string, userId: string): Promise<void> {
        const ofxData = await this.ofxParserPort.parse(ofxContent);

        const statementResponse = ofxData?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS;
        const transactions = statementResponse?.BANKTRANLIST?.STMTTRN;

        if (!transactions || !Array.isArray(transactions)) {
            return;
        }

        for (const transaction of transactions) {
            const amount = Number(transaction.TRNAMT);

            if (Number.isNaN(amount)) {
                continue;
            }

            const transactionDate = this.parseOfxDate(transaction.DTPOSTED);

            if (!transactionDate) {
                continue;
            }

            const type: TransactionType = amount >= 0 ? "income" : "expense";
            const paymentMethod: PaymentMethod = "bank_transfer";
            const transactionStatus: TransactionStatus = "paid";

            const dto: TransactionDomainDTO = {
                transactionId: "",
                user: null,
                type,
                amount: Math.abs(amount),
                paymentMethod,
                installments: null,
                currentInstallment: null,
                description: transaction.MEMO || transaction.NAME || null,
                transactionStatus,
                transactionDate,
                dueDate: null,
                paymentDate: null,
                createdAt: null,
                updatedAt: null,
            };

            const domain = TransactionAdapter.toDomain(dto);

            await this.transactionsPort.createTransaction(domain, userId);
        }
    }

    private parseOfxDate(date: string | undefined): Date | null {
        if (!date || date.length < 8) {
            return null;
        }

        const year = Number(date.slice(0, 4));
        const month = Number(date.slice(4, 6)) - 1;
        const day = Number(date.slice(6, 8));

        if (!year || Number.isNaN(month) || !day) {
            return null;
        }

        return new Date(Date.UTC(year, month, day));
    }
}
