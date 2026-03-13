import TelegramBot from "node-telegram-bot-api";

type RegisterResponse = {
  success: boolean;
  data?: {
    user: {
      id: string;
      telegram_id: string;
      username: string | null;
      created_at: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
};

const token = process.env.TELEGRAM_BOT_TOKEN;
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3000";

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/start$/, async (msg) => {
  const telegramId = String(msg.from?.id ?? "").trim();
  const username = msg.from?.username ?? null;

  if (!telegramId) {
    await bot.sendMessage(
      msg.chat.id,
      "Не удалось получить Telegram ID. Попробуйте снова.",
    );
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_id: telegramId,
        username,
      }),
    });

    const payload = (await response.json()) as RegisterResponse;

    if (!response.ok || !payload.success || !payload.data?.user) {
      throw new Error(payload.error?.message ?? "Register failed");
    }

    const user = payload.data.user;
    await bot.sendMessage(
      msg.chat.id,
      [
        "Добро пожаловать в CoinPulse!",
        `Ваш user id: ${user.id}`,
        `Telegram ID: ${user.telegram_id}`,
        `Username: ${user.username ?? "(не указан)"}`,
        `Создан: ${user.created_at}`,
      ].join("\n"),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await bot.sendMessage(
      msg.chat.id,
      `Не удалось зарегистрировать пользователя: ${message}`,
    );
  }
});

console.log("Telegram bot is running (polling mode)");
