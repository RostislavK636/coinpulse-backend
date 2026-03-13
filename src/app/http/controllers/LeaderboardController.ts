import type { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../../modules/users/infrastructure/repositories/UserRepository";

export class LeaderboardController {
  constructor(private readonly userRepository = new UserRepository()) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userRepository.getLeaderboard(20);
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
}
