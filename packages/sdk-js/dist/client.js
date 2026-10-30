"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagClient = void 0;
const cache_1 = require("./cache");
const subscriber_1 = require("./subscriber");
const rule_engine_1 = require("@feature-flag/rule-engine");
class FeatureFlagClient {
    constructor(options) {
        this.options = options;
        this.cache = new cache_1.LocalCache();
    }
    async init() {
        await this.fetchFlags();
        this.subscriber = new subscriber_1.FlagSubscriber(this.options.redisUrl, (update) => {
            if (update.type === 'FLAG_UPDATED' || update.type === 'FLAG_CREATED') {
                this.cache.set(update.flag.key, update.flag);
            }
            else if (update.type === 'FLAG_DELETED') {
                this.cache.delete(update.flagKey);
            }
            else if (update.type === 'RELOAD_ALL') {
                this.fetchFlags();
            }
        });
    }
    async fetchFlags() {
        try {
            const response = await fetch(`${this.options.apiUrl}/api/v1/flags`);
            if (response.ok) {
                const flags = await response.json();
                const flagMap = {};
                for (const flag of flags) {
                    flagMap[flag.key] = flag;
                }
                this.cache.setAll(flagMap);
            }
        }
        catch (error) {
            console.error('Falha ao buscar flags no Control Plane:', error);
        }
    }
    evaluate(flagKey, context = {}) {
        const flag = this.cache.get(flagKey);
        if (!flag) {
            return false;
        }
        return (0, rule_engine_1.evaluateFlag)(flag, context);
    }
    close() {
        this.subscriber?.disconnect();
    }
}
exports.FeatureFlagClient = FeatureFlagClient;
