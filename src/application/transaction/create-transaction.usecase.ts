import { CategoryTypeEnumValues } from "../../core/domain/categories/dto";
import { PaymentMethodValues, TransactionStatusValues } from "../../core/domain/transactions/dto";
import { CategoryPort } from "../../core/port/category.port";
import { TransactionPort } from "../../core/port/transaction.port";
import { CategoryDomainAdapter } from "../../infrastructure/adapters/category/in/category.domain.adapter";
import { TransactionDomainAdapter } from "../../infrastructure/adapters/transaction/in/transaction.domain.adapter";
import { TransactionOutput } from "../../infrastructure/adapters/transaction/out/dto";
import { TransactionInput } from "../../infrastructure/nestjs/body-inputs/transaction/transaction.input";
import { NotFoundException } from "../../shared/errors/custom.exception";

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionPort: TransactionPort,
    private readonly categoryPort: CategoryPort
  ) {}

  async execute(createTransactionDto: TransactionInput, userId: string): Promise<TransactionOutput> {
    const category = await this.categoryPort.findCategoryById(createTransactionDto.categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const transactionStatus = TransactionStatusValues.find((item) => item === createTransactionDto.transactionStatus);
    const paymentMethod = PaymentMethodValues.find((item) => item === createTransactionDto.paymentMethod);
    const transactionType = CategoryTypeEnumValues.find((item) => item === createTransactionDto.transactionType);

    const categoryDomain = CategoryDomainAdapter.toDomain({
      categoryId: category.getCategoryId().getValue(),
      categoryName: category.getCategoryName(),
      categoryType: category.getCategoryType(),
    });

    const domain = TransactionDomainAdapter.toDomain({
      amount: createTransactionDto.amount,
      paymentMethod: paymentMethod!,
      transactionStatus: transactionStatus!,
      transactionType: transactionType!,
      transactionDate: new Date(createTransactionDto.transactionDate),
      category: categoryDomain,
    })

    const createdTransaction = await this.transactionPort.createTransaction(domain, userId);

    return {
      amount: createdTransaction.getAmount(),
      paymentMethod: createdTransaction.getPaymentMethod(),
      transactionDate: createdTransaction.getTransactionDate(),
      transactionType: createdTransaction.getTransactionType(),
      categoryName: createdTransaction.getCategory()?.getCategoryName()!,
    };
  }
}