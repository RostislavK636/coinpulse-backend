type UserRecord = {
  id: string;
  telegramId: string;
  firstName: string;
  username?: string;
};

const users = new Map<string, UserRecord>();

export class AuthRepository {
  async findOrCreateByTelegramUser(input: {
    telegramId: string;
    firstName: string;
    username?: string;
  }) {
    const existing = users.get(input.telegramId);
    if (existing) {
      return { user: existing, isNewUser: false };
    }

    const created: UserRecord = {
      id: `user-${input.telegramId}`,
      telegramId: input.telegramId,
      firstName: input.firstName,
      username: input.username,
    };
    users.set(input.telegramId, created);
    return { user: created, isNewUser: true };
  }
}
