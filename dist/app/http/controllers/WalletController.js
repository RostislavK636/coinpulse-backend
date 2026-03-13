import { randomUUID } from "node:crypto";
import { WithdrawalService } from "../../../modules/wallet/application/services/WithdrawalService";
import { WalletRepository } from "../../../modules/wallet/infrastructure/repositories/WalletRepository";
export class WalletController {
    withdrawalService;
    walletRepository;
    constructor(withdrawalService = new WithdrawalService(), walletRepository = new WalletRepository()) {
        this.withdrawalService = withdrawalService;
        this.walletRepository = walletRepository;
    }
    withdraw = async (req, res, next) => {
        try {
            const userId = req.authUserId ?? "user-1";
            const result = await this.withdrawalService.createWithdrawal({
                userId,
                amount: req.body.amount,
                availableBalance: 500,
                network: req.body.network,
                address: req.body.address,
            });
            await this.walletRepository.createWithdrawal({
                id: randomUUID(),
                userId,
                amount: result.amount,
                fee: result.fee,
                netAmount: result.netAmount,
                status: "pending",
            });
            res.status(200).json({
                success: true,
                data: {
                    withdrawalId: result.id,
                    status: result.status,
                    amount: result.amount,
                    fee: result.fee,
                    netAmount: result.netAmount,
                    createdAt: new Date().toISOString(),
                },
                meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
