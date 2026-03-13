"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTestService = void 0;
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
class UserTestService {
    repository;
    constructor(repository = new UserRepository_1.UserRepository()) {
        this.repository = repository;
    }
    async createAndListUsers() {
        await this.repository.createOrGetTestUser();
        return this.repository.findAll();
    }
}
exports.UserTestService = UserTestService;
