import { getBucketValue } from './hashing';

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

export function evaluateFlag(
  flag: FeatureFlag,
  context: EvaluationContext
): boolean | string | number | object {
  if (!flag.enabled) {
    return flag.defaultValue;
  }

  if (!flag.rules || flag.rules.length === 0) {
    return true;
  }

  for (const rule of flag.rules) {
    let ruleMatches = true;

    if (rule.conditions && rule.conditions.length > 0) {
      for (const cond of rule.conditions) {
        const attrValue = context.attributes?.[cond.attribute];

        if (attrValue === undefined) {
          ruleMatches = false;
          break;
        }

        const strValue = String(attrValue);

        switch (cond.operator) {
          case 'EQUALS':
            if (strValue !== cond.values[0]) ruleMatches = false;
            break;
          case 'IN':
            if (!cond.values.includes(strValue)) ruleMatches = false;
            break;
          case 'NOT_IN':
            if (cond.values.includes(strValue)) ruleMatches = false;
            break;
        }

        if (!ruleMatches) break;
      }
    }

    if (ruleMatches && rule.percentage !== undefined && context.userId) {
      const bucket = getBucketValue(flag.key, context.userId);
      if (bucket >= rule.percentage) {
        ruleMatches = false;
      }
    }

    if (ruleMatches) {
      return rule.value;
    }
  }

  return flag.defaultValue;
}