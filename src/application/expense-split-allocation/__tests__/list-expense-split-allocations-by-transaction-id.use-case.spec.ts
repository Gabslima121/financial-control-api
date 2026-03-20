import { ExpenseSplitAllocationPort } from 'src/core/port/expense-split-allocation.port';
import { ExpenseSplitAllocationDomain } from 'src/core/domain/expense-split-allocation/expense-split-allocation.domain';
import { ListExpenseSplitAllocationsByTransactionIdUseCase } from '../list-expense-split-allocations-by-transaction-id.use-case';

const TX_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const PERSON_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const ALLOC_UUID = 'c3d4e5f6-a7b8-4901-acde-f12345678901';

const makeExpenseSplitAllocationPort = (): jest.Mocked<ExpenseSplitAllocationPort> => ({
  createMany: jest.fn(),
  listByTransactionId: jest.fn(),
});

const makeAllocation = () =>
  ExpenseSplitAllocationDomain.create({
    id: ALLOC_UUID,
    transactionId: TX_UUID,
    personId: PERSON_UUID,
    amount: 1500,
    createdAt: new Date('2024-01-01'),
  });

describe('ListExpenseSplitAllocationsByTransactionIdUseCase', () => {
  let expenseSplitAllocationPort: jest.Mocked<ExpenseSplitAllocationPort>;
  let useCase: ListExpenseSplitAllocationsByTransactionIdUseCase;

  beforeEach(() => {
    expenseSplitAllocationPort = makeExpenseSplitAllocationPort();
    useCase = new ListExpenseSplitAllocationsByTransactionIdUseCase(
      expenseSplitAllocationPort,
    );
  });

  it('deve retornar lista de alocações para transação', async () => {
    expenseSplitAllocationPort.listByTransactionId.mockResolvedValue([
      makeAllocation(),
    ]);

    const result = await useCase.execute(TX_UUID);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ExpenseSplitAllocationDomain);
    expect(result[0].getAmount()).toBe(1500);
    expect(expenseSplitAllocationPort.listByTransactionId).toHaveBeenCalledWith(TX_UUID);
  });

  it('deve retornar lista vazia quando não há alocações', async () => {
    expenseSplitAllocationPort.listByTransactionId.mockResolvedValue([]);

    const result = await useCase.execute(TX_UUID);

    expect(result).toHaveLength(0);
  });
});
