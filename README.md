# CoinPulse Backend

## Prerequisites

- Node.js 20+
- Docker with PostgreSQL container
- `.env` with `DATABASE_URL`, for example:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coinpulse"
```

## Install dependencies

```bash
npm install
```

## One-command local DB bootstrap

Run a single command to create/start Docker PostgreSQL and apply Prisma schema:

```bash
npm run db:up
```

By default it uses container `coinpulse-db-5433` and `localhost:5433`.
You can override with env vars: `DB_CONTAINER_NAME`, `DB_IMAGE`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

## Prisma setup

Create migration:

```bash
npx prisma migrate dev --name add_user_fields
```

Apply existing migrations (for non-dev environments):

```bash
npx prisma migrate deploy
```

Generate Prisma Client:

```bash
npx prisma generate
```

## Run backend

```bash
npm run dev
```

Backend listens on `PORT` or `3000`.

## Register endpoint

`POST /register`

Request body:

```json
{
  "telegram_id": "123456789",
  "username": "coinpulse_user"
}
```

Response body:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "telegram_id": "123456789",
      "username": "coinpulse_user",
      "created_at": "2026-03-13T18:30:00.000Z"
    }
  }
}
```

Behavior:

- registration is based only on `telegram_id` (no email/password)
- if user already exists, backend returns existing record
- if user does not exist, backend creates a new user

## Telegram bot

Bot file: `bot.ts` (uses `node-telegram-bot-api`).

Required env vars:

```bash
TELEGRAM_BOT_TOKEN="<your_bot_token>"
BACKEND_URL="http://localhost:3000"
```

Run bot:

```bash
npm run bot
```

Alternative:

```bash
npx tsx bot.ts
```

`/start` flow:

- bot reads `msg.from.id` and `msg.from.username`
- bot sends `POST /register` to backend
- bot replies with greeting and saved user data

## How to verify locally

1. Start PostgreSQL in Docker.
2. Run `npm install`.
3. Run Prisma commands: `npx prisma migrate dev --name add_user_fields` and `npx prisma generate`.
4. Start backend: `npm run dev`.
5. Start bot: `npm run bot`.
6. In Telegram, send `/start` to the bot.
7. Verify saved user in DB (for example via Prisma Studio):

```bash
npx prisma studio
```

### Проверка API

Получить пользователя

```bash
curl "http://localhost:3000/me?telegram_id=123"
```

Сделать tap

```bash
curl -X POST "http://localhost:3000/tap" \
  -H "Content-Type: application/json" \
  -d '{"telegram_id":123}'
```

Leaderboard

```bash
curl "http://localhost:3000/leaderboard"
```

Daily reward

```bash
curl -X POST "http://localhost:3000/daily" \
  -H "Content-Type: application/json" \
  -d '{"telegram_id":123}'
```
