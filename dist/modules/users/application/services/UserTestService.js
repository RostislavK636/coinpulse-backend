import { UserRepository } from "../../infrastructure/repositories/UserRepository";
export class UserTestService {
    repository;
    constructor(repository = new UserRepository()) {
        this.repository = repository;
    }
    async createAndListUsers() {
        await this.repository.createOrGetTestUser();
        return this.repository.findAll();
    }
}
