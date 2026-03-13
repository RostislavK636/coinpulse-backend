"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const node_crypto_1 = require("node:crypto");
const WithdrawalService_1 = require("../../../modules/wallet/application/services/WithdrawalService");
const WalletRepository_1 = require("../../../modules/wallet/infrastructure/repositories/WalletRepository");
class WalletController {
    withdrawalService;
    walletRepository;
    constructor(withdrawalService = new WithdrawalService_1.WithdrawalService(), walletRepository = new WalletRepository_1.WalletRepository()) {
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
                id: (0, node_crypto_1.randomUUID)(),
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
exports.WalletController = WalletController;
