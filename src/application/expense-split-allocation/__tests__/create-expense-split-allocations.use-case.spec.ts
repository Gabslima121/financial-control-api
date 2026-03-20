import { ExpenseSplitAllocationPort } from 'src/core/port/expense-split-allocation.port';
import { ExpenseSplitAllocationDomain } from 'src/core/domain/expense-split-allocation/expense-split-allocation.domain';
import { CreateExpenseSplitAllocationsUseCase } from '../create-expense-split-allocations.use-case';

const TX_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const PERSON_UUID_1 = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const PERSON_UUID_2 = 'c3d4e5f6-a7b8-4901-acde-f12345678901';

const makeExpenseSplitAllocationPort = (): jest.Mocked<ExpenseSplitAllocationPort> => ({
  createMany: jest.fn(),
  listByTransactionId: jest.fn(),
});

describe('CreateExpenseSplitAllocationsUseCase', () => {
  let expenseSplitAllocationPort: jest.Mocked<ExpenseSplitAllocationPort>;
  let useCase: CreateExpenseSplitAllocationsUseCase;

  beforeEach(() => {
    expenseSplitAllocationPort = makeExpenseSplitAllocationPort();
    useCase = new CreateExpenseSplitAllocationsUseCase(expenseSplitAllocationPort);
  });

  it('deve criar alocações para cada participante', async () => {
    expenseSplitAllocationPort.createMany.mockResolvedValue(undefined);

    await useCase.execute({
      transactionId: TX_UUID,
      allocations: [
        { personId: PERSON_UUID_1, amount: 2000 },
        { personId: PERSON_UUID_2, amount: 1000 },
      ],
    });

    expect(expenseSplitAllocationPort.createMany).toHaveBeenCalledTimes(1);
    const domains = expenseSplitAllocationPort.createMany.mock.calls[0][0];
    expect(domains).toHaveLength(2);
    expect(domains[0]).toBeInstanceOf(ExpenseSplitAllocationDomain);
    expect(domains[0].getAmount()).toBe(2000);
    expect(domains[1].getAmount()).toBe(1000);
  });

  it('deve passar transactionId correto para cada alocação', async () => {
    expenseSplitAllocationPort.createMany.mockResolvedValue(undefined);

    await useCase.execute({
      transactionId: TX_UUID,
      allocations: [{ personId: PERSON_UUID_1, amount: 3000 }],
    });

    const domains = expenseSplitAllocationPort.createMany.mock.calls[0][0];
    expect(domains[0].getTransactionId()).toBe(TX_UUID);
  });

  it('deve chamar createMany com lista vazia quando não há alocações', async () => {
    expenseSplitAllocationPort.createMany.mockResolvedValue(undefined);

    await useCase.execute({ transactionId: TX_UUID, allocations: [] });

    expect(expenseSplitAllocationPort.createMany).toHaveBeenCalledWith([]);
  });
});
