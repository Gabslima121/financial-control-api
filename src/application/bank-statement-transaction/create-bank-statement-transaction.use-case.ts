import { Injectable, NotFoundException } from "@nestjs/common";
import { BankStatementTransactionPort } from "src/core/port/bank-statement-transaction.port";
import { AccountPort } from "src/core/port/account.port";
import { parse } from 'ofx-parser';
import { BankStatementTransactionDomain } from "src/core/domain/bank-statement-transaction/bank-statement-transaction.domain";
import { AccountDomainAdapter } from "src/infrastructure/adapters/account/in/account.adapter";

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
