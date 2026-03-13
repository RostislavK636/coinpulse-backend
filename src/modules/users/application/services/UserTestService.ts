import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export class UserTestService {
  constructor(private readonly repository = new UserRepository()) {}

  async createAndListUsers() {
    await this.repository.createOrGetTestUser();
    return this.repository.findAll();
  }
}
