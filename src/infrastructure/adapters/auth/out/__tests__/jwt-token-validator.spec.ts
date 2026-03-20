import { JwtTokenValidatorRepository } from '../jwt-token-validator.repository';

const JWT_SECRET = 'test-secret-key';

describe('JwtTokenValidatorRepository', () => {
  let repo: JwtTokenValidatorRepository;

  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    repo = new JwtTokenValidatorRepository();
  });

  afterEach(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  describe('createToken()', () => {
    it('deve criar um token JWT válido para payload objeto', async () => {
      const token = await repo.createToken({ userId: 'abc', accountId: 'xyz' });

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('deve criar um token JWT válido para payload string', async () => {
      const token = await repo.createToken('user-id');

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('deve lançar UnauthorizedException quando JWT_SECRET não está configurado', () => {
      delete process.env.JWT_SECRET;

      expect(() => repo.createToken({ userId: 'abc' })).toThrow(
        'JWT secret not configured',
      );
    });
  });

  describe('validateToken()', () => {
    it('deve validar e decodificar um token criado pelo próprio repositório', async () => {
      const payload = { userId: 'abc', accountId: 'xyz' };
      const token = await repo.createToken(payload);

      const decoded = (await repo.validateToken(token)) as Record<
        string,
        string
      >;

      expect(decoded.userId).toBe('abc');
      expect(decoded.accountId).toBe('xyz');
    });

    it('deve lançar UnauthorizedException para token inválido', () => {
      expect(() => repo.validateToken('token.invalido.aqui')).toThrow(
        'Invalid token',
      );
    });

    it('deve lançar UnauthorizedException quando JWT_SECRET não está configurado', async () => {
      const token = await repo.createToken({ userId: 'abc' });
      delete process.env.JWT_SECRET;

      expect(() => repo.validateToken(token)).toThrow(
        'JWT secret not configured',
      );
    });
  });
});
