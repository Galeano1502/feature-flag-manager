import crypto from 'crypto';

/**
 * Retorna um inteiro de 0 a 99 baseado na combinação da chave da flag e da chave do usuário.
 * Garante distribuição uniforme e determinística.
 */
export function getBucketValue(flagKey: string, userKey: string): number {
  const hash = crypto
    .createHash('md5')
    .update(`${flagKey}:${userKey}`)
    .digest('hex');

  const hashInt = parseInt(hash.substring(0, 8), 16);

  return hashInt % 100;
}