import { Injectable } from '@nestjs/common';
import { BankStatementTransactionPort } from 'src/core/port/bank-statement-transaction.port';
import { AccountPort } from 'src/core/port/account.port';
import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { parse } from 'ofx-parser';
import { BankStatementTransactionDomain } from 'src/core/domain/bank-statement-transaction/bank-statement-transaction.domain';
import { FinancialTransactionDomain } from 'src/core/domain/financial-transaction/financial-transaction.domain';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { AccountDomainAdapter } from 'src/infrastructure/adapters/account/in/account.adapter';
import { BankStatementTransactionAdapter } from 'src/infrastructure/adapters/bank-statement-transaction/in/bank-statement-transaction.adapter';
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';
import { NotFoundException } from 'src/shared/errors/custom.exception';

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

    const transactions = await this.parseOfxTransactions(file);

    for (const transaction of transactions) {
      await this.processTransaction(transaction, accountId, account);
    }
  }

  private async parseOfxTransactions(file: Buffer): Promise<OfxTransaction[]> {
    const ofxText = file.toString('utf-8');
    const parsed = (await parse(ofxText)) as unknown as OfxStructure;

    if (!parsed) {
      throw new Error('Erro ao parsear o OFX.');
    }

    const transactionsData =
      parsed?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STMTTRN;

    if (!transactionsData) {
      throw new Error('Nenhuma transação encontrada no OFX.');
    }

    return Array.isArray(transactionsData) ? transactionsData : [transactionsData];
  }

  private async processTransaction(
    transaction: OfxTransaction,
    accountId: string,
    account: AccountDomain,
  ): Promise<void> {
    const existing = await this.bankStatementTransactionRepository.findByFitId(
      accountId,
      transaction.FITID,
    );

    if (existing) {
      return;
    }

    const bankStatement = BankStatementTransactionDomain.create({
      accountId,
      account: AccountDomainAdapter.toDTO(account),
      fitId: transaction.FITID,
      amount: parseFloat(transaction.TRNAMT),
      postedAt: this.parseOfxDate(transaction.DTPOSTED),
      description: transaction.MEMO,
      rawType: transaction.TRNTYPE,
    });

    await this.bankStatementTransactionRepository.create(bankStatement);
    await this.reconcileWithFinancialTransaction(bankStatement, account);
  }

  private async reconcileWithFinancialTransaction(
    bankStatement: BankStatementTransactionDomain,
    account: AccountDomain,
  ): Promise<void> {
    const matching =
      await this.financialTransactionRepository.findMatchingTransaction(
        account.getId(),
        bankStatement.getAmount(),
        {
          start: new Date(
            bankStatement.getPostedAt().getTime() - 2 * 24 * 60 * 60 * 1000,
          ),
          end: new Date(
            bankStatement.getPostedAt().getTime() + 2 * 24 * 60 * 60 * 1000,
          ),
        },
      );

    if (matching) {
      matching.linkBankStatement(bankStatement);
      matching.confirmPayment(bankStatement.getPostedAt());
      await this.financialTransactionRepository.update(matching);
      return;
    }

    const newFinancialTransaction = FinancialTransactionDomain.create({
      account,
      type:
        bankStatement.getAmount() > 0
          ? TransactionType.INCOME
          : TransactionType.EXPENSE,
      status: TransactionStatus.PAID,
      amount: Math.abs(bankStatement.getAmount()),
      description: bankStatement.getDescription() || 'Importado via OFX',
      paymentMethod: PaymentMethod.OTHER,
      dueDate: bankStatement.getPostedAt(),
      paidAt: bankStatement.getPostedAt(),
      installments: 1,
      installment: 1,
      bankStatement: BankStatementTransactionAdapter.toDTO(bankStatement),
    });

    await this.financialTransactionRepository.create(newFinancialTransaction);
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
