import { AccountDomain } from '../account.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

const baseProps = {
  name: 'Conta Principal',
  bankName: 'Nubank',
  initialBalance: 1000,
};

describe('AccountDomain', () => {
  describe('create()', () => {
    it('deve criar uma conta com id fornecido', () => {
      const account = AccountDomain.create({ ...baseProps, id: VALID_UUID });
      expect(account.getId()).toBe(VALID_UUID);
    });

    it('deve gerar um UUID quando id não é fornecido', () => {
      const account = AccountDomain.create(baseProps);
      expect(account.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('deve aceitar bankName nulo', () => {
      const account = AccountDomain.create({ ...baseProps, bankName: null });
      expect(account.getBankName()).toBeNull();
    });

    it('deve aceitar user nulo', () => {
      const account = AccountDomain.create({ ...baseProps, user: null });
      expect(account.getUser()).toBeNull();
    });
  });

  describe('getters', () => {
    let account: AccountDomain;

    beforeEach(() => {
      account = AccountDomain.create({
        ...baseProps,
        id: VALID_UUID,
        createdAt: new Date('2024-01-01'),
      });
    });

    it('deve retornar o nome', () => {
      expect(account.getName()).toBe('Conta Principal');
    });

    it('deve retornar o bankName', () => {
      expect(account.getBankName()).toBe('Nubank');
    });

    it('deve retornar o saldo inicial', () => {
      expect(account.getInitialBalance()).toBe(1000);
    });

    it('deve retornar createdAt', () => {
      expect(account.getCreatedAt()).toEqual(new Date('2024-01-01'));
    });
  });
});
