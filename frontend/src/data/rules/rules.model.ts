import {RulesDetailsTO} from "./rules.transfer";

export interface RulesDetails extends Omit<RulesDetailsTO, "rules"> {
    rules: Map<string, string>,
}
