import { UserDomain } from '../../users/users.domain';
import { CategoriesDomain } from '../categories.domain';
import { CategoryTypeEnum } from '../dto';

describe('CategoriesDomain', () => {
  const baseUserParams = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    userName: 'Alice',
    userDocument: '12345678000195',
    email: 'alice@example.com',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    isActive: true,
  };

  const buildBaseCategoryParams = (overrides: Partial<{
    categoryId: string;
    user: UserDomain | null;
    categoryName: string;
    categoryType: CategoryTypeEnum;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  }> = {}) => {
    const user = UserDomain.create(baseUserParams);
    return {
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      user,
      categoryName: 'Aluguel',
      categoryType: CategoryTypeEnum.EXPENSE,
      description: 'Despesa mensal de aluguel',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      isActive: true,
      ...overrides,
    };
  };

  it('deve criar uma categoria com dados básicos', () => {
    const params = buildBaseCategoryParams();
    const category = CategoriesDomain.create(params);

    expect(category.getCategoryId().getValue()).toBe(params.categoryId);
    expect(category.getUser()).toBe(params.user);
    expect(category.getCategoryName()).toBe(params.categoryName);
    expect(category.getCategoryType()).toBe(params.categoryType);
    expect(category.getDescription()).toBe(params.description);
    expect(category.getIsActive()).toBe(true);
    expect(category.getCreatedAt()).toBeInstanceOf(Date);
    expect(category.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('deve gerar um UUID quando categoryId estiver vazio', () => {
    const params = buildBaseCategoryParams({ categoryId: '' });
    const category = CategoriesDomain.create(params);
    const generatedId = category.getCategoryId().getValue();

    expect(generatedId).not.toBe('');
    // Verifica formato geral de UUID v4
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(generatedId)).toBe(true);
  });

  it('deve inativar e ativar a categoria atualizando o updatedAt', () => {
    const params = buildBaseCategoryParams({ isActive: false });
    const category = CategoriesDomain.create(params);

    // ativar
    const beforeActivate = category.getUpdatedAt();
    category.activeCategory();
    expect(category.getIsActive()).toBe(true);
    expect(category.getUpdatedAt()).not.toBe(beforeActivate);
    expect(category.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(beforeActivate.getTime());

    // inativar
    const beforeInactive = category.getUpdatedAt();
    category.inactiveCategory();
    expect(category.getIsActive()).toBe(false);
    expect(category.getUpdatedAt()).not.toBe(beforeInactive);
    expect(category.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(beforeInactive.getTime());
  });

  it('deve atualizar a descrição e o updatedAt', () => {
    const params = buildBaseCategoryParams();
    const category = CategoriesDomain.create(params);

    const before = category.getUpdatedAt();
    category.updateDescription('Nova descrição');
    expect(category.getDescription()).toBe('Nova descrição');
    expect(category.getUpdatedAt()).not.toBe(before);
    expect(category.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(before.getTime());

    const beforeNull = category.getUpdatedAt();
    category.updateDescription(null);
    expect(category.getDescription()).toBeNull();
    expect(category.getUpdatedAt()).not.toBe(beforeNull);
    expect(category.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(beforeNull.getTime());
  });

  it('deve aceitar usuário nulo', () => {
    const params = buildBaseCategoryParams({ user: null });
    const category = CategoriesDomain.create(params);
    expect(category.getUser()).toBeNull();
  });

  it('deve suportar tipos de categoria INCOME e EXPENSE', () => {
    const incomeParams = buildBaseCategoryParams({
      categoryType: CategoryTypeEnum.INCOME,
      categoryName: 'Salário',
      description: 'Receita mensal de salário',
    });
    const income = CategoriesDomain.create(incomeParams);
    expect(income.getCategoryType()).toBe(CategoryTypeEnum.INCOME);
    expect(income.getCategoryName()).toBe('Salário');

    const expenseParams = buildBaseCategoryParams({
      categoryType: CategoryTypeEnum.EXPENSE,
      categoryName: 'Energia',
      description: 'Despesa de energia elétrica',
    });
    const expense = CategoriesDomain.create(expenseParams);
    expect(expense.getCategoryType()).toBe(CategoryTypeEnum.EXPENSE);
    expect(expense.getCategoryName()).toBe('Energia');
  });
});