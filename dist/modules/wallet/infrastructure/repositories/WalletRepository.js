"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const withdrawals = new Map();
class WalletRepository {
    async createWithdrawal(record) {
        const current = withdrawals.get(record.userId) ?? [];
        withdrawals.set(record.userId, [...current, record]);
    }
}
exports.WalletRepository = WalletRepository;
