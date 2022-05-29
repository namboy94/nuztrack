import {useQuery, UseQueryResult} from "react-query";
import {RulesDetails} from "./rulesTransfer";
import {loadRules} from "./rulesApi";

export function useRulesQuery(): UseQueryResult<RulesDetails> {
    return useQuery("/rules", loadRules)
}