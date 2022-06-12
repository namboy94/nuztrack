import {RulesDetailsTO} from "./rules.transfer";
import {RulesDetails} from "./rules.model";

export const RULES_DETAILS_TO: RulesDetailsTO = {
    defaultRules: ["DEATH", "NICKNAME"],
    rules: {
        "DEATH": "Pokemon die when they are killed",
        "NICKNAME": "Pokemon Need Nicknames",
        "DUPLICATE_CLAUSE": "No Duplicates"
    }
}
export const RULES_DETAILS: RulesDetails = {
    defaultRules: ["DEATH", "NICKNAME"],
    rules: new Map<string, string>([
        ["DEATH", "Pokemon die when they are killed"],
        ["NICKNAME", "Pokemon Need Nicknames"],
        ["DUPLICATE_CLAUSE", "No Duplicates"]
    ])
}