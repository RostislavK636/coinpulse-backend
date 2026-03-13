"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const GameTapService_1 = require("../../../modules/game/application/services/GameTapService");
const GameRepository_1 = require("../../../modules/game/infrastructure/repositories/GameRepository");
class GameController {
    gameRepository;
    gameTapService;
    constructor(gameRepository = new GameRepository_1.GameRepository(), gameTapService = new GameTapService_1.GameTapService()) {
        this.gameRepository = gameRepository;
        this.gameTapService = gameTapService;
    }
    getState = async (req, res, next) => {
        try {
            const state = await this.gameRepository.getState(req.authUserId ?? "user-1");
            res.status(200).json({
                success: true,
                data: state,
                meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
            });
        }
        catch (error) {
            next(error);
        }
    };
    tap = async (req, res, next) => {
        try {
            const userId = req.authUserId ?? "user-1";
            const currentState = await this.gameRepository.getState(userId);
            const result = await this.gameTapService.applyTap({
                userId,
                taps: req.body.taps,
                currentState,
            });
            await this.gameRepository.saveState(userId, result.state);
            res.status(200).json({
                success: true,
                data: result,
                meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.GameController = GameController;
