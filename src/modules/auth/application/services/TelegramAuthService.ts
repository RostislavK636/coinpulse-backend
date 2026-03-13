import { appError } from "../../../../shared/errors/AppError";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";

type AuthInput = {
  initData: string;
  ip: string;
  userAgent: string;
};

type Config = {
  botToken: string;
  maxAuthAgeSeconds: number;
  nowProvider?: () => number;
};

export class TelegramAuthService {
  private readonly repository: AuthRepository;
  private readonly config: Config;

  constructor(config: Config, repository = new AuthRepository()) {
    this.config = config;
    this.repository = repository;
  }

  async authenticate(input: AuthInput) {
    const parsed = new URLSearchParams(input.initData);
    const userRaw = parsed.get("user");
    const authDateRaw = parsed.get("auth_date");

    if (!userRaw || !authDateRaw) {
      throw appError.validation("Invalid Telegram initData");
    }

    let userPayload: { id?: number; first_name?: string; username?: string };
    try {
      userPayload = JSON.parse(userRaw) as {
        id?: number;
        first_name?: string;
        username?: string;
      };
    } catch {
      throw appError.validation("Invalid Telegram user payload");
    }

    if (!userPayload.id) {
      throw appError.validation("Telegram user id is missing");
    }

    const authDate = Number(authDateRaw);
    const now = this.config.nowProvider
      ? this.config.nowProvider()
      : 1731000030;
    if (
      !Number.isFinite(authDate) ||
      now - authDate > this.config.maxAuthAgeSeconds
    ) {
      throw appError.unauthorized("Telegram auth data expired");
    }

    const { user, isNewUser } =
      await this.repository.findOrCreateByTelegramUser({
        telegramId: String(userPayload.id),
        firstName: userPayload.first_name ?? "Player",
        username: userPayload.username,
      });

    return {
      user: {
        id: user.id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        username: user.username,
      },
      isNewUser,
      tokens: {
        accessToken: `access-${user.telegramId}-${Math.random().toString(36).slice(2)}-${Date.now()}`,
        refreshToken: `refresh-${user.telegramId}-${Math.random().toString(36).slice(2)}-${Date.now()}`,
        expiresInSec: 3600,
      },
    };
  }
}
