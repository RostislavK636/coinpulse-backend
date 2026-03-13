import "dotenv/config";
function required(name) {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
const rawPort = required("PORT");
const port = Number(rawPort);
if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
}
export const env = {
    DATABASE_URL: required("DATABASE_URL"),
    PORT: port,
    TG_BOT_TOKEN: required("TG_BOT_TOKEN"),
};
