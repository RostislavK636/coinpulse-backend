import type { NextFunction, Request, Response } from "express";
import { UserService } from "../../../modules/users/application/services/UserService";

const TELEGRAM_API_BASE = "https://api.telegram.org";
const TELEGRAM_BOT_TOKEN =
  process.env.TG_BOT_TOKEN ?? "8647462360:AAFdB6l0FaEWdwX-faF6CLWlCuy5rMEMBao";

type TelegramWebhookUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number };
    from?: {
      id?: number;
      username?: string;
    };
  };
};

export class TelegramWebhookController {
  constructor(private readonly userService = new UserService()) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const update = (req.body ?? {}) as TelegramWebhookUpdate;
      const message = update.message;

      if (!message || message.text !== "/start") {
        res.status(200).json({ success: true, data: { handled: false } });
        return;
      }

      const telegramId = message.from?.id;
      const chatId = message.chat?.id;

      if (!telegramId || !chatId) {
        res.status(200).json({ success: true, data: { handled: false } });
        return;
      }

      await this.userService.registerByTelegramId({
        telegramId: BigInt(telegramId),
        username: message.from?.username,
      });

      await fetch(`${TELEGRAM_API_BASE}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Добро пожаловать в CoinPulse 🚀",
        }),
      });

      res.status(200).json({ success: true, data: { handled: true } });
    } catch (error) {
      next(error);
    }
  };
}
