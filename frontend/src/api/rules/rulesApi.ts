import axios from "axios";
import {RulesDetails} from "./rulesTypes";
import {convertRulesDetailsTOToRulesDetails} from "./rulesConvert";

export function loadRules(): Promise<RulesDetails> {
    return axios.get("/rules").then(x => convertRulesDetailsTOToRulesDetails(x.data))
}