import { Injectable, NotFoundException } from "@nestjs/common";
import { BankStatementTransactionPort } from "src/core/port/bank-statement-transaction.port";
import { AccountPort } from "src/core/port/account.port";
import { FinancialTransactionPort } from "src/core/port/financial-transaction.port";
import { parse } from 'ofx-parser';
import { BankStatementTransactionDomain } from "src/core/domain/bank-statement-transaction/bank-statement-transaction.domain";
import { FinancialTransactionDomain } from "src/core/domain/financial-transaction/financial-transaction.domain";
import { AccountDomainAdapter } from "src/infrastructure/adapters/account/in/account.adapter";
import { PaymentMethod, TransactionStatus, TransactionType } from "src/core/domain/financial-transaction/dto";

interface OfxTransaction {
    TRNTYPE: string;
    DTPOSTED: string;
    TRNAMT: string;
    FITID: string;
    MEMO: string;
}

interface OfxStructure {
    OFX: {
        BANKMSGSRSV1: {
            STMTTRNRS: {
                STMTRS: {
                    BANKTRANLIST: {
                        STMTTRN: OfxTransaction[] | OfxTransaction;
                    };
                };
            };
        };
    };
}

@Injectable()
export class CreateBankStatementTransactionUseCase {
    constructor(
        private readonly bankStatementTransactionRepository: BankStatementTransactionPort,
        private readonly accountRepository: AccountPort,
        private readonly financialTransactionRepository: FinancialTransactionPort,
    ) {}

    async execute(props: { accountId: string; file: Buffer }) {
        const { accountId, file } = props;

        const account = await this.accountRepository.findById(accountId);

        if (!account) {
            throw new NotFoundException('Conta não encontrada.');
        }

        const ofxText = file.toString('utf-8');

        const parsed = await parse(ofxText) as unknown as OfxStructure;

        if (!parsed) {
            throw new Error('Erro ao parsear o OFX.');
        }
        
        const transactionsData =
            parsed?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STMTTRN;

        if (!transactionsData) {
            throw new Error('Nenhuma transação encontrada no OFX.');
        }

        const transactions = Array.isArray(transactionsData) ? transactionsData : [transactionsData];

        for (const transaction of transactions) {
            const existingTransaction = await this.bankStatementTransactionRepository.findByFitId(
                accountId,
                transaction.FITID,
            );

            if (existingTransaction) {
                continue;
            }

            const newTransaction = BankStatementTransactionDomain.create({
                accountId,
                account: AccountDomainAdapter.toDTO(account),
                fitId: transaction.FITID,
                amount: parseFloat(transaction.TRNAMT),
                postedAt: this.parseOfxDate(transaction.DTPOSTED),
                description: transaction.MEMO,
                rawType: transaction.TRNTYPE,
            });

            await this.bankStatementTransactionRepository.create(newTransaction);

            const matchingFinancialTransaction = await this.financialTransactionRepository.findMatchingTransaction(
                accountId,
                newTransaction.getAmount(),
                {
                    start: new Date(newTransaction.getPostedAt().getTime() - 2 * 24 * 60 * 60 * 1000), // -2 dias
                    end: new Date(newTransaction.getPostedAt().getTime() + 2 * 24 * 60 * 60 * 1000),   // +2 dias
                }
            );

            if (matchingFinancialTransaction) {
                matchingFinancialTransaction.confirmPayment(
                    newTransaction.getId(),
                    newTransaction.getPostedAt()
                );
                await this.financialTransactionRepository.update(matchingFinancialTransaction);
            } else {
                const newFinancialTransaction = FinancialTransactionDomain.create({
                    accountId,
                    account: AccountDomainAdapter.toDTO(account),
                    type: newTransaction.getAmount() > 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
                    status: TransactionStatus.PAID,
                    amount: Math.abs(newTransaction.getAmount()),
                    description: newTransaction.getDescription() || 'Importado via OFX',
                    paymentMethod: PaymentMethod.OTHER,
                    dueDate: newTransaction.getPostedAt(),
                    paidAt: newTransaction.getPostedAt(),
                    installments: 1,
                    installment: 1,
                    bankStatementId: newTransaction.getId(),
                });
                await this.financialTransactionRepository.create(newFinancialTransaction);
            }
        }
    }

    private parseOfxDate(dateString: string): Date {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1;
        const day = parseInt(dateString.substring(6, 8), 10);
        const hour = parseInt(dateString.substring(8, 10), 10);
        const minute = parseInt(dateString.substring(10, 12), 10);
        const second = parseInt(dateString.substring(12, 14), 10);

        return new Date(year, month, day, hour, minute, second);
    }
}
