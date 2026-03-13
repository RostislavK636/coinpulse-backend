import { UserRepository } from "../../../modules/users/infrastructure/repositories/UserRepository";
export class LeaderboardController {
    userRepository;
    constructor(userRepository = new UserRepository()) {
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
