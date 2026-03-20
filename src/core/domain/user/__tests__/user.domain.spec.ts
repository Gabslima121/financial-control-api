import { UserDomain } from '../user.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const VALID_CPF = '11144477735';
const VALID_CNPJ = '12345678000195';

const baseProps = {
  name: 'Gabriel Lima',
  document: VALID_CPF,
  email: 'gabriel@email.com',
  password: 'hashed_password',
  isActive: true,
};

describe('UserDomain', () => {
  describe('create()', () => {
    it('deve criar um usuário com id fornecido', () => {
      const user = UserDomain.create({ ...baseProps, id: VALID_UUID });
      expect(user.getId()).toBe(VALID_UUID);
    });

    it('deve gerar um UUID quando id não é fornecido', () => {
      const user = UserDomain.create(baseProps);
      expect(user.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('deve aceitar CPF como documento', () => {
      const user = UserDomain.create({ ...baseProps, document: VALID_CPF });
      expect(user.getDocument()).toBe(VALID_CPF);
    });

    it('deve aceitar CNPJ como documento', () => {
      const user = UserDomain.create({ ...baseProps, document: VALID_CNPJ });
      expect(user.getDocument()).toBe(VALID_CNPJ);
    });

    it('deve lançar erro para CPF inválido', () => {
      expect(() =>
        UserDomain.create({ ...baseProps, document: '00000000000' }),
      ).toThrow();
    });

    it('deve lançar erro para CNPJ inválido', () => {
      expect(() =>
        UserDomain.create({ ...baseProps, document: '11111111111111' }),
      ).toThrow();
    });
  });

  describe('getters', () => {
    let user: UserDomain;

    beforeEach(() => {
      user = UserDomain.create({
        ...baseProps,
        id: VALID_UUID,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      });
    });

    it('deve retornar o nome', () => {
      expect(user.getName()).toBe('Gabriel Lima');
    });

    it('deve retornar o email', () => {
      expect(user.getEmail()).toBe('gabriel@email.com');
    });

    it('deve retornar a senha', () => {
      expect(user.getPassword()).toBe('hashed_password');
    });

    it('deve retornar isActive', () => {
      expect(user.getIsActive()).toBe(true);
    });

    it('deve retornar createdAt', () => {
      expect(user.getCreatedAt()).toEqual(new Date('2024-01-01'));
    });

    it('deve retornar updatedAt', () => {
      expect(user.getUpdatedAt()).toEqual(new Date('2024-01-02'));
    });
  });

  describe('setActive() / setInactive()', () => {
    it('deve desativar o usuário', () => {
      const user = UserDomain.create({ ...baseProps, isActive: true });
      user.setInactive();
      expect(user.getIsActive()).toBe(false);
    });

    it('deve ativar o usuário', () => {
      const user = UserDomain.create({ ...baseProps, isActive: false });
      user.setActive();
      expect(user.getIsActive()).toBe(true);
    });
  });
});
