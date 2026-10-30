"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBucketValue = getBucketValue;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Retorna um inteiro de 0 a 99 baseado na combinação da chave da flag e da chave do usuário.
 * Garante distribuição uniforme e determinística.
 */
function getBucketValue(flagKey, userKey) {
    const hash = crypto_1.default
        .createHash('md5')
        .update(`${flagKey}:${userKey}`)
        .digest('hex');
    const hashInt = parseInt(hash.substring(0, 8), 16);
    return hashInt % 100;
}
