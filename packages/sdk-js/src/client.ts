import { LocalCache } from './cache';
import { FlagSubscriber } from './subscriber';
import { evaluateFlag, FeatureFlag, EvaluationContext } from '@feature-flag/rule-engine';

export interface SDKOptions {
  apiUrl: string;
  redisUrl: string;
  pollIntervalMs?: number;
}

export class FeatureFlagClient {
  private cache = new LocalCache();
  private subscriber?: FlagSubscriber;

  constructor(private options: SDKOptions) {}

  async init(): Promise<void> {
    await this.fetchFlags();

    this.subscriber = new FlagSubscriber(this.options.redisUrl, (update) => {
      if (update.type === 'FLAG_UPDATED' || update.type === 'FLAG_CREATED') {
        this.cache.set(update.flag.key, update.flag);
      } else if (update.type === 'FLAG_DELETED') {
        this.cache.delete(update.flagKey);
      } else if (update.type === 'RELOAD_ALL') {
        this.fetchFlags();
      }
    });
  }

  private async fetchFlags(): Promise<void> {
    try {
      const response = await fetch(`${this.options.apiUrl}/api/v1/flags`);
      if (response.ok) {
        const flags: FeatureFlag[] = await response.json();
        const flagMap: Record<string, FeatureFlag> = {};
        for (const flag of flags) {
          flagMap[flag.key] = flag;
        }
        this.cache.setAll(flagMap);
      }
    } catch (error) {
      console.error('Falha ao buscar flags no Control Plane:', error);
    }
  }

  evaluate(flagKey: string, context: EvaluationContext = {}): boolean | string | number | object {
    const flag: FeatureFlag | undefined = this.cache.get(flagKey);

    if (!flag) {
      return false;
    }

    return evaluateFlag(flag, context);
  }

  close() {
    this.subscriber?.disconnect();
  }
}