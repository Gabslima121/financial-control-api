import { UserDomain } from '../users.domain';

describe('UserDomain', () => {
  const baseParams = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    userName: 'Alice',
    userDocument: '12345678000195',
    email: 'alice@example.com',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    isActive: true,
  };

  it('deve criar um usuário com CNPJ', () => {
    const user = UserDomain.create(baseParams);
    expect(user.getUserId().getValue()).toBe(baseParams.userId);
    expect(user.getUserName()).toBe(baseParams.userName);
    expect(user.getUserDocument().getValue()).toBe('12345678000195');
    expect(user.getEmail()).toBe(baseParams.email);
    expect(user.getIsActive()).toBe(true);
    expect(user.getCreatedAt()).toBeInstanceOf(Date);
    expect(user.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('deve criar um usuário com CPF quando documento não é CNPJ', () => {
    const params = { ...baseParams, userDocument: '52998224725' };
    const user = UserDomain.create(params);
    expect(user.getUserDocument().getValue()).toBe('52998224725');
  });

  it('deve atualizar o email e o updatedAt', () => {
    const user = UserDomain.create(baseParams);
    const before = user.getUpdatedAt();
    user.updateEmail('alice.new@example.com');
    expect(user.getEmail()).toBe('alice.new@example.com');
    expect(user.getUpdatedAt()).not.toBe(before);
    expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('deve ativar e inativar o usuário', () => {
    const user = UserDomain.create({ ...baseParams, isActive: false });
    user.activateUser();
    expect(user.getIsActive()).toBe(true);
    const afterActivate = user.getUpdatedAt();
    user.inactiveUser();
    expect(user.getIsActive()).toBe(false);
    expect(user.getUpdatedAt()).not.toBe(afterActivate);
    expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(afterActivate.getTime());
  });
});