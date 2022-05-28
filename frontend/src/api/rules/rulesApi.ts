import axios from "axios";
import {RulesDetails} from "./rulesTransfer";
import {convertRulesDetailsTOToRulesDetails} from "./rulesConvert";

export function loadRules(): Promise<RulesDetails> {
    return axios.get("/rules").then(x => convertRulesDetailsTOToRulesDetails(x.data))
}