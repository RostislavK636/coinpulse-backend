import type { NextFunction, Request, Response } from "express";
import { UserTestService } from "../../../modules/users/application/services/UserTestService";

export class TestController {
  constructor(private readonly service = new UserTestService()) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.createAndListUsers();
      const serializableUsers = users.map(
        (user: {
          id: any;
          telegram_id: any;
          username: any;
          balance: any;
          energy: any;
          createdAt: { toISOString: () => any };
        }) => ({
          id: user.id,
          telegram_id: Number(user.telegram_id),
          username: user.username,
          balance: user.balance,
          energy: user.energy,
          createdAt: user.createdAt.toISOString(),
        }),
      );
      res.status(200).json({
        success: true,
        data: serializableUsers,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
