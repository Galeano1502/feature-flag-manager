/**
 * Retorna um inteiro de 0 a 99 baseado na combinação da chave da flag e da chave do usuário.
 * Garante distribuição uniforme e determinística.
 */
export declare function getBucketValue(flagKey: string, userKey: string): number;
