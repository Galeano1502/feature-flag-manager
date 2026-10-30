"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagSubscriber = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class FlagSubscriber {
    constructor(redisUrl, onUpdate) {
        this.redis = new ioredis_1.default(redisUrl);
        this.redis.subscribe('flag_updates', (err) => {
            if (err) {
                console.error('Erro ao se inscrever no canal Redis Pub/Sub:', err);
            }
        });
        this.redis.on('message', (channel, message) => {
            if (channel === 'flag_updates') {
                try {
                    const parsed = JSON.parse(message);
                    onUpdate(parsed);
                }
                catch (e) {
                    console.error('Mensagem Pub/Sub malformada recebida:', message);
                }
            }
        });
    }
    disconnect() {
        this.redis.disconnect();
    }
}
exports.FlagSubscriber = FlagSubscriber;
