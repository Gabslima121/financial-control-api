import { CategoriesDomain } from "../../../../core/domain/categories/categories.domain";
import { CategoriesDomainDTO } from "../../../../core/domain/categories/dto";

export class CategoryDomainAdapter {
  public static toDomain(dto: CategoriesDomainDTO): CategoriesDomain {
    return CategoriesDomain.create(dto);
  }

  public static toDTO(domain: CategoriesDomain): CategoriesDomainDTO {
    return {
      categoryId: domain.getCategoryId().getValue(),
      user: domain.getUser(),
      categoryName: domain.getCategoryName(),
      categoryType: domain.getCategoryType(),
      description: domain.getDescription(),
      createdAt: domain.getCreatedAt(),
      updatedAt: domain.getUpdatedAt(),
      isActive: domain.getIsActive(),
    };
  }
}