# CoinPulse Backend Deployment Checklist

- [ ] Environment variables configured: `DATABASE_URL`, `PORT`, `TG_BOT_TOKEN`
- [ ] Database migration/schema applied (`npx prisma migrate deploy` or `npx prisma db push`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Backend starts successfully and `/health` returns success
- [ ] Telegram bot token is valid and bot can call backend endpoints
- [ ] Telegram Mini App URL is configured correctly
- [ ] HTTPS is enabled in production ingress/reverse proxy
