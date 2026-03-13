export type WithdrawalRecord = {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: "pending";
};

const withdrawals = new Map<string, WithdrawalRecord[]>();

export class WalletRepository {
  async createWithdrawal(record: WithdrawalRecord): Promise<void> {
    const current = withdrawals.get(record.userId) ?? [];
    withdrawals.set(record.userId, [...current, record]);
  }
}
