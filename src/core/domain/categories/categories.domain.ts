import { UuidValueObject } from '../../../shared/value-object/uuid-value-object.vo';
import { UserDomain } from '../users/users.domain';
import { CategoriesDomainDTO, CategoryTypeEnum } from './dto';

export class CategoriesDomain {
  private readonly categoryId: UuidValueObject;
  private readonly user?: UserDomain | null;
  private readonly categoryName: string;
  private readonly categoryType: CategoryTypeEnum;
  private description?: string | null;
  private readonly createdAt: Date;

  private constructor(params: CategoriesDomainDTO) {
    this.categoryId = params.categoryId
      ? new UuidValueObject(params.categoryId)
      : new UuidValueObject();
    this.user = params.user;
    this.categoryName = params.categoryName;
    this.categoryType = params.categoryType;
    this.description = params.description || null;
    this.createdAt = new Date();
  }

  static create(params: CategoriesDomainDTO): CategoriesDomain {
    return new CategoriesDomain(params);
  }

  getCategoryId(): UuidValueObject {
    return this.categoryId;
  }

  getUser(): UserDomain | null {
    return this.user!;
  }

  getCategoryName(): string {
    return this.categoryName;
  }

  getCategoryType(): CategoryTypeEnum {
    return this.categoryType;
  }

  getDescription(): string | null {
    return this.description!;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
