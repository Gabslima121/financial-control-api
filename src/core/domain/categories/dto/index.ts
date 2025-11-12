import { UserDomain } from '../../users/users.domain';

export enum CategoryTypeEnum {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export const CategoryTypeEnumValues = Object.values(CategoryTypeEnum);

export interface CategoriesDomainDTO {
  categoryId?: string;
  user?: UserDomain | null;
  categoryName: string;
  categoryType: CategoryTypeEnum;
  description?: string | null;
  createdAt?: Date;
}
