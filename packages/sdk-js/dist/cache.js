"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCache = void 0;
class LocalCache {
    constructor() {
        this.cache = new Map();
    }
    get(key) {
        return this.cache.get(key);
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    setAll(flags) {
        this.cache.clear();
        for (const [key, value] of Object.entries(flags)) {
            this.cache.set(key, value);
        }
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
}
exports.LocalCache = LocalCache;
