import { UserDomain } from '../../users/users.domain';

export enum CategoryTypeEnum {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface CategoriesDomainDTO {
  categoryId: string;
  user?: UserDomain | null;
  categoryName: string;
  categoryType: CategoryTypeEnum;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
