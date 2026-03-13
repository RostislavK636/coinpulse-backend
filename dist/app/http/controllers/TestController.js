import { UserTestService } from "../../../modules/users/application/services/UserTestService";
export class TestController {
    service;
    constructor(service = new UserTestService()) {
        this.service = service;
    }
    handle = async (req, res, next) => {
        try {
            const users = await this.service.createAndListUsers();
            const serializableUsers = users.map((user) => ({
                id: user.id,
                telegram_id: Number(user.telegram_id),
                username: user.username,
                balance: user.balance,
                energy: user.energy,
                createdAt: user.createdAt.toISOString(),
            }));
            res.status(200).json({
                success: true,
                data: serializableUsers,
                meta: {
                    requestId: req.requestId,
                    timestamp: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
