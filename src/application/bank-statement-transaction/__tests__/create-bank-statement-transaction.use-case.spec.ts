import { AccountPort } from 'src/core/port/account.port';
import { BankStatementTransactionPort } from 'src/core/port/bank-statement-transaction.port';
import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { FinancialTransactionDomain } from 'src/core/domain/financial-transaction/financial-transaction.domain';
import { BankStatementTransactionDomain } from 'src/core/domain/bank-statement-transaction/bank-statement-transaction.domain';
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';
import { CreateBankStatementTransactionUseCase } from '../create-bank-statement-transaction.use-case';

const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const makeAccountPort = (): jest.Mocked<AccountPort> => ({
  findById: jest.fn(),
  createAccount: jest.fn(),
  listAccountsByUserId: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
});

const makeBankStatementPort = (): jest.Mocked<BankStatementTransactionPort> => ({
  create: jest.fn(),
  findByFitId: jest.fn(),
  listByAccountId: jest.fn(),
  sumAmountByAccountId: jest.fn(),
});

const makeFinancialTransactionPort = (): jest.Mocked<FinancialTransactionPort> => ({
  create: jest.fn(),
  findById: jest.fn(),
  listByAccountId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findMatchingTransaction: jest.fn(),
  getPendingTransactionsByAccountId: jest.fn(),
  syncRecurringTransactions: jest.fn(),
});

const makeAccount = () =>
  AccountDomain.create({
    id: ACCOUNT_UUID,
    name: 'Conta',
    bankName: null,
    initialBalance: 0,
  });

const makeOfxBuffer = (transactions: object[]) => {
  const stmttrn = transactions
    .map(
      (t: any) =>
        `<STMTTRN><TRNTYPE>${t.type}</TRNTYPE><DTPOSTED>${t.date}</DTPOSTED><TRNAMT>${t.amount}</TRNAMT><FITID>${t.fitId}</FITID><MEMO>${t.memo}</MEMO></STMTTRN>`,
    )
    .join('');

  const ofx = `
OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE
<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<STMTRS>
<BANKTRANLIST>
${stmttrn}
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;
  return Buffer.from(ofx, 'utf-8');
};

describe('CreateBankStatementTransactionUseCase', () => {
  let accountPort: jest.Mocked<AccountPort>;
  let bankStatementPort: jest.Mocked<BankStatementTransactionPort>;
  let financialTransactionPort: jest.Mocked<FinancialTransactionPort>;
  let useCase: CreateBankStatementTransactionUseCase;

  beforeEach(() => {
    accountPort = makeAccountPort();
    bankStatementPort = makeBankStatementPort();
    financialTransactionPort = makeFinancialTransactionPort();
    useCase = new CreateBankStatementTransactionUseCase(
      bankStatementPort,
      accountPort,
      financialTransactionPort,
    );
  });

  it('deve lançar erro quando conta não existe', async () => {
    accountPort.findById.mockResolvedValue(null);
    const file = makeOfxBuffer([]);

    await expect(
      useCase.execute({ accountId: ACCOUNT_UUID, file }),
    ).rejects.toThrow('Conta não encontrada.');
  });

  it('deve pular transação já existente no extrato', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    bankStatementPort.findByFitId.mockResolvedValue(
      BankStatementTransactionDomain.create({
        accountId: ACCOUNT_UUID,
        account: { name: 'Conta', bankName: null, initialBalance: 0 },
        fitId: 'FIT001',
        amount: -3000,
        postedAt: new Date('2024-03-10'),
        description: 'Aluguel',
        rawType: 'DEBIT',
      }),
    );

    const file = makeOfxBuffer([
      {
        type: 'DEBIT',
        date: '20240310120000',
        amount: '-3000',
        fitId: 'FIT001',
        memo: 'Aluguel',
      },
    ]);

    await useCase.execute({ accountId: ACCOUNT_UUID, file });

    expect(bankStatementPort.create).not.toHaveBeenCalled();
  });

  it('deve criar transação financeira correspondente quando encontrada', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    bankStatementPort.findByFitId.mockResolvedValue(null);
    bankStatementPort.create.mockResolvedValue(undefined);

    const matchingTx = FinancialTransactionDomain.create({
      account: makeAccount(),
      type: TransactionType.EXPENSE,
      status: TransactionStatus.PENDING,
      amount: 3000,
      description: 'Aluguel',
      paymentMethod: PaymentMethod.PIX,
      dueDate: new Date('2024-03-10'),
      paidAt: null,
      installments: 1,
      installment: 1,
      bankStatement: null,
    });
    financialTransactionPort.findMatchingTransaction.mockResolvedValue(matchingTx);
    financialTransactionPort.update.mockResolvedValue(undefined);

    const file = makeOfxBuffer([
      {
        type: 'DEBIT',
        date: '20240310120000',
        amount: '-3000',
        fitId: 'FIT002',
        memo: 'Aluguel',
      },
    ]);

    await useCase.execute({ accountId: ACCOUNT_UUID, file });

    expect(financialTransactionPort.update).toHaveBeenCalledTimes(1);
    expect(financialTransactionPort.create).not.toHaveBeenCalled();
  });

  it('deve criar nova transação financeira quando não há correspondência', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    bankStatementPort.findByFitId.mockResolvedValue(null);
    bankStatementPort.create.mockResolvedValue(undefined);
    financialTransactionPort.findMatchingTransaction.mockResolvedValue(null);
    financialTransactionPort.create.mockResolvedValue(undefined);

    const file = makeOfxBuffer([
      {
        type: 'DEBIT',
        date: '20240310120000',
        amount: '-3000',
        fitId: 'FIT003',
        memo: 'Mercado',
      },
    ]);

    await useCase.execute({ accountId: ACCOUNT_UUID, file });

    expect(financialTransactionPort.create).toHaveBeenCalledTimes(1);
    expect(financialTransactionPort.update).not.toHaveBeenCalled();
  });
});
