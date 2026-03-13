"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalService = void 0;
const node_crypto_1 = require("node:crypto");
const AppError_1 = require("../../../../shared/errors/AppError");
class WithdrawalService {
    async createWithdrawal(input) {
        if (input.amount <= 0) {
            throw AppError_1.appError.validation("amount must be positive");
        }
        if (!/^UQ[A-Za-z0-9]{42}$/.test(input.address)) {
            throw AppError_1.appError.validation("invalid wallet address");
        }
        if (input.amount > 100_000) {
            throw AppError_1.appError.withdrawalLimit();
        }
        if (input.amount > input.availableBalance) {
            throw AppError_1.appError.insufficientFunds();
        }
        const fee = Math.max(1, Math.floor(input.amount * 0.01));
        return {
            id: (0, node_crypto_1.randomUUID)(),
            status: "pending",
            amount: input.amount,
            fee,
            netAmount: input.amount - fee,
            network: input.network,
            address: input.address,
        };
    }
}
exports.WithdrawalService = WithdrawalService;
