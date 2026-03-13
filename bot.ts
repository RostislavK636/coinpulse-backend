import "dotenv/config";

const TELEGRAM_BOT_TOKEN =
  process.env.TG_BOT_TOKEN ?? "8647462360:AAFdB6l0FaEWdwX-faF6CLWlCuy5rMEMBao";
const WEBHOOK_URL =
  "https://coinpulse-backend-production.up.railway.app/telegram/webhook";

async function setupWebhook() {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: WEBHOOK_URL,
      }),
    },
  );

  const payload = await response.json();

  if (!response.ok || !payload?.ok) {
    throw new Error(
      `Failed to set Telegram webhook: ${JSON.stringify(payload)}`,
    );
  }

  console.log("Telegram webhook configured successfully", payload);
}

void setupWebhook();
