import {useQuery, UseQueryResult} from "react-query";
import {RulesDetails} from "./rulesTypes";
import {loadRules} from "./rulesApi";

const RULES_KEY = "/rules"

export function useRulesQuery(): UseQueryResult<RulesDetails> {
    return useQuery(RULES_KEY, loadRules)
}