"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
const node_crypto_1 = require("node:crypto");
function requestIdMiddleware(req, _res, next) {
    req.requestId = (0, node_crypto_1.randomUUID)();
    next();
}
