export interface RuleCondition {
    attribute: string;
    operator: 'IN' | 'NOT_IN' | 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN';
    values: string[];
}
export interface FlagRule {
    id: string;
    percentage?: number;
    conditions?: RuleCondition[];
    value: boolean | string | number | object;
}
export interface FeatureFlag {
    key: string;
    enabled: boolean;
    defaultValue: boolean | string | number | object;
    rules?: FlagRule[];
}
export interface EvaluationContext {
    userId?: string;
    attributes?: Record<string, string | number | boolean>;
}
export declare function evaluateFlag(flag: FeatureFlag, context: EvaluationContext): boolean | string | number | object;
