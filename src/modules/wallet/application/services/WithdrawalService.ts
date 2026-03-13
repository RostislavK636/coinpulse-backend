import { randomUUID } from "node:crypto";
import { appError } from "../../../../shared/errors/AppError";

export type WalletNetwork = "TON" | "EVM";

export class WithdrawalService {
  async createWithdrawal(input: {
    userId: string;
    amount: number;
    availableBalance: number;
    network: WalletNetwork;
    address: string;
  }) {
    if (input.amount <= 0) {
      throw appError.validation("amount must be positive");
    }

    if (!/^UQ[A-Za-z0-9]{42}$/.test(input.address)) {
      throw appError.validation("invalid wallet address");
    }

    if (input.amount > 100_000) {
      throw appError.withdrawalLimit();
    }

    if (input.amount > input.availableBalance) {
      throw appError.insufficientFunds();
    }

    const fee = Math.max(1, Math.floor(input.amount * 0.01));
    return {
      id: randomUUID(),
      status: "pending" as const,
      amount: input.amount,
      fee,
      netAmount: input.amount - fee,
      network: input.network,
      address: input.address,
    };
  }
}
