"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardController = void 0;
const UserRepository_1 = require("../../../modules/users/infrastructure/repositories/UserRepository");
class LeaderboardController {
    userRepository;
    constructor(userRepository = new UserRepository_1.UserRepository()) {
        this.userRepository = userRepository;
    }
    list = async (_req, res, next) => {
        try {
            const users = await this.userRepository.getLeaderboard(20);
            res.status(200).json({
                success: true,
                data: users,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.LeaderboardController = LeaderboardController;
