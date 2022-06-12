import {RulesDetailsTO} from "./rules.transfer";
import {RulesDetails} from "./rules.model";

class RulesConverter {
    convertRulesDetailsTOToModel(rulesDetailsTO: RulesDetailsTO): RulesDetails {
        const rules = new Map<string, string>(Object.entries(rulesDetailsTO.rules))
        return {...rulesDetailsTO, rules: rules}
    }
}

export const rulesConverter = new RulesConverter()
