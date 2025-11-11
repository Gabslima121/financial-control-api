import { AccountBalanceDomain } from '../account-balance.domain';
import { UserDomain } from '../../users/users.domain';

describe('AccountBalanceDomain', () => {
  const baseUserParams = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    userName: 'Alice',
    userDocument: '12345678000195',
    email: 'alice@example.com',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    isActive: true,
  };

  const buildBaseParams = (
    overrides: Partial<Parameters<typeof AccountBalanceDomain.create>[0]> = {},
  ) => {
    const user = UserDomain.create(baseUserParams);
    return {
      balanceId: '550e8400-e29b-41d4-a716-446655440000',
      user,
      balance: 1234.56,
      balanceDate: new Date('2024-03-10'),
      description: 'Saldo consolidado',
      ...overrides,
    };
  };

  it('deve criar um balance com dados básicos', () => {
    const params = buildBaseParams();
    const balance = AccountBalanceDomain.create(params);
    expect(balance.getBalanceId()).toBe(params.balanceId);
    expect(balance.getUser()).toBe(params.user);
    expect(balance.getBalance()).toBe(params.balance);
    expect(balance.getBalanceDate()).toEqual(params.balanceDate);
    expect(balance.getDescription()).toBe(params.description);
  });

  it('deve gerar UUID quando balanceId estiver vazio', () => {
    const params = buildBaseParams({ balanceId: '' });
    const balance = AccountBalanceDomain.create(params);
    const generatedId = balance.getBalanceId();
    expect(generatedId).not.toBe('');
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(generatedId)).toBe(true);
  });

  it('deve aceitar usuário nulo', () => {
    const params = buildBaseParams({ user: null });
    const balance = AccountBalanceDomain.create(params);
    expect(balance.getUser()).toBeNull();
  });

  it('deve permitir descrição nula', () => {
    const params = buildBaseParams({ description: null });
    const balance = AccountBalanceDomain.create(params);
    expect(balance.getDescription()).toBeNull();
  });

  it('deve lançar erro para UUID inválido', () => {
    const params = buildBaseParams({ balanceId: 'invalid-uuid' });
    expect(() => AccountBalanceDomain.create(params)).toThrow(/Invalid UUID/i);
  });
});
