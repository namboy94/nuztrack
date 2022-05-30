import {RulesDetails, RulesDetailsTO} from "./rulesTypes";

export function convertRulesDetailsTOToRulesDetails(rulesDetailsTO: RulesDetailsTO): RulesDetails {
    const rulesMapping = new Map<string, string>(Object.entries(rulesDetailsTO.rules))
    return {
        rules: rulesMapping,
        defaultRules: rulesDetailsTO.defaultRules
    }
}