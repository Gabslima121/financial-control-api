import { TransactionsDomain } from '../transactions.domain';
import { PaymentMethodEnum, TransactionStatusEnum } from '../dto';
import { CategoryTypeEnum } from '../../categories/dto';
import { UserDomain } from '../../users/users.domain';
import { CategoriesDomain } from '../../categories/categories.domain';
import { PaymentDestinationsDomain } from '../../payment-destinations/payment-destinations.domain';

describe('TransactionsDomain', () => {
  const baseUserParams = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    userName: 'Alice',
    userDocument: '12345678000195',
    email: 'alice@example.com',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    isActive: true,
  };

  const buildRefs = () => {
    const user = UserDomain.create(baseUserParams);
    const category = CategoriesDomain.create({
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      user,
      categoryName: 'Aluguel',
      categoryType: CategoryTypeEnum.EXPENSE,
      description: 'Despesa mensal de aluguel',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      isActive: true,
    });
    const destination = PaymentDestinationsDomain.create({
      paymentDestinationId: '550e8400-e29b-41d4-a716-446655440000',
      user,
      companyName: 'Companhia de Energia',
      companyDocument: '12345678000195',
      description: 'Fornecedor de energia',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    });
    return { user, category, destination };
  };

  const buildBaseParams = (overrides: Partial<Parameters<typeof TransactionsDomain.create>[0]> = {}) => {
    const { user, category, destination } = buildRefs();
    return {
      transactionId: '550e8400-e29b-41d4-a716-446655440000',
      user,
      category,
      destination,
      transactionType: CategoryTypeEnum.EXPENSE,
      amount: 199.9,
      paymentMethod: PaymentMethodEnum.CREDIT_CARD,
      installments: 3,
      currentInstallment: 1,
      parentTransactionId: null,
      description: 'Conta de energia',
      transactionStatus: TransactionStatusEnum.PENDING,
      transactionDate: new Date('2024-02-10'),
      dueDate: new Date('2024-02-20'),
      paymentDate: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      ...overrides,
    };
  };

  it('deve criar uma transação com dados completos', () => {
    const params = buildBaseParams();
    const tx = TransactionsDomain.create(params);

    expect(tx.getTransactionId().getValue()).toBe(params.transactionId);
    expect(tx.getUser()).toBe(params.user);
    expect(tx.getCategory()).toBe(params.category);
    expect(tx.getDestination()).toBe(params.destination);
    expect(tx.getTransactionType()).toBe(params.transactionType);
    expect(tx.getAmount()).toBe(params.amount);
    expect(tx.getPaymentMethod()).toBe(params.paymentMethod);
    expect(tx.getInstallments()).toBe(params.installments);
    expect(tx.getCurrentInstallment()).toBe(params.currentInstallment);
    expect(tx.getParentTransactionId()).toBe(params.parentTransactionId);
    expect(tx.getDescription()).toBe(params.description);
    expect(tx.getTransactionStatus()).toBe(params.transactionStatus);
    expect(tx.getTransactionDate()).toEqual(params.transactionDate);
    expect(tx.getDueDate()).toEqual(params.dueDate);
    expect(tx.getPaymentDate()).toBeNull();
    expect(tx.getCreatedAt()).toBeInstanceOf(Date);
    expect(tx.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('deve gerar UUID quando transactionId estiver vazio', () => {
    const params = buildBaseParams({ transactionId: '' });
    const tx = TransactionsDomain.create(params);
    const generatedId = tx.getTransactionId().getValue();
    expect(generatedId).not.toBe('');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(generatedId)).toBe(true);
  });

  it('deve atualizar descrição e status com updatedAt', () => {
    const tx = TransactionsDomain.create(buildBaseParams());

    const beforeDesc = tx.getUpdatedAt();
    tx.updateDescription('Nova descrição');
    expect(tx.getDescription()).toBe('Nova descrição');
    expect(tx.getUpdatedAt()).not.toBe(beforeDesc);

    const beforeStatus = tx.getUpdatedAt();
    tx.setStatus(TransactionStatusEnum.PAID);
    expect(tx.getTransactionStatus()).toBe(TransactionStatusEnum.PAID);
    expect(tx.getUpdatedAt()).not.toBe(beforeStatus);
  });

  it('deve atualizar paymentDate e updatedAt', () => {
    const tx = TransactionsDomain.create(buildBaseParams());
    const before = tx.getUpdatedAt();
    const payDate = new Date('2024-02-15T10:00:00Z');
    tx.setPaymentDate(payDate);
    expect(tx.getPaymentDate()).toEqual(payDate);
    expect(tx.getUpdatedAt()).not.toBe(before);
  });

  it('deve aceitar usuário, categoria e destino nulos', () => {
    const tx = TransactionsDomain.create(buildBaseParams({ user: null, category: null, destination: null }));
    expect(tx.getUser()).toBeNull();
    expect(tx.getCategory()).toBeNull();
    expect(tx.getDestination()).toBeNull();
  });
});