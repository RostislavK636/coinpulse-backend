const withdrawals = new Map();
export class WalletRepository {
    async createWithdrawal(record) {
        const current = withdrawals.get(record.userId) ?? [];
        withdrawals.set(record.userId, [...current, record]);
    }
}
