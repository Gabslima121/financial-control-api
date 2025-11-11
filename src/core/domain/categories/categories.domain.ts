import { UuidValueObject } from "../../../shared/value-object/uuid-value-object.vo";
import { UserDomain } from "../users/users.domain";
import { CategoriesDomainDTO, CategoryTypeEnum } from "./dto";

export class CategoriesDomain {
  private readonly categoryId: UuidValueObject;
  private readonly user?: UserDomain | null;
  private readonly categoryName: string;
  private readonly categoryType: CategoryTypeEnum;
  private description?: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private isActive: boolean;

  private constructor(params: CategoriesDomainDTO) {
    this.categoryId = params.categoryId ? new UuidValueObject(params.categoryId) : new UuidValueObject();
    this.user = params.user;
    this.categoryName = params.categoryName;
    this.categoryType = params.categoryType;
    this.description = params.description || null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isActive = params.isActive;
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

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  inactiveCategory(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activeCategory(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this.description = description || null;
    this.updatedAt = new Date();
  }
}