import { AccountPort } from '../../core/port/account.port';

export class GetUserAccountsUseCase {
  constructor(private readonly accountPort: AccountPort) {}

  async execute(userId: string) {
    const accounts = await this.accountPort.listAccountsByUserId(userId);

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found for the user');
    }

    return accounts.map((account) => ({
      id: account.getId(),
      name: account.getName(),
      bankName: account.getBankName(),
      initialBalance: account.getInitialBalance(),
      createdAt: account.getCreatedAt(),
    }));
  }
}
