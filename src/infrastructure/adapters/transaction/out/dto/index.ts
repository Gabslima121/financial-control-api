export interface TransactionOutput {
  transactionId?: string;
  amount: number;
  paymentMethod: string;
  transactionDate: Date;
  transactionType: string;
  categoryName: string;
  userName?: string;
  destinationName?: string;
  installments?: number;
  currentInstallment?: number;
  parentTransactionId?: string;
  description?: string;
  transactionStatus?: string;
  dueDate?: Date;
  paymentDate?: Date;
}
