"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateFlag = evaluateFlag;
const hashing_1 = require("./hashing");
function evaluateFlag(flag, context) {
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
                        if (strValue !== cond.values[0])
                            ruleMatches = false;
                        break;
                    case 'IN':
                        if (!cond.values.includes(strValue))
                            ruleMatches = false;
                        break;
                    case 'NOT_IN':
                        if (cond.values.includes(strValue))
                            ruleMatches = false;
                        break;
                }
                if (!ruleMatches)
                    break;
            }
        }
        if (ruleMatches && rule.percentage !== undefined && context.userId) {
            const bucket = (0, hashing_1.getBucketValue)(flag.key, context.userId);
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
