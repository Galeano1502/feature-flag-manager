import { EvaluationContext } from '@feature-flag/rule-engine';
export interface SDKOptions {
    apiUrl: string;
    redisUrl: string;
    pollIntervalMs?: number;
}
export declare class FeatureFlagClient {
    private options;
    private cache;
    private subscriber?;
    constructor(options: SDKOptions);
    init(): Promise<void>;
    private fetchFlags;
    evaluate(flagKey: string, context?: EvaluationContext): boolean | string | number | object;
    close(): void;
}
