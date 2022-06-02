import axios from "axios";
import {RulesDetails} from "./rulesTypes";

export function loadRules(): Promise<RulesDetails> {
    return axios.get("/api/rules").then(
        x => {
            return {
                "rules": new Map<string, string>(Object.entries(x.data.rules)),
                "defaultRules": x.data.defaultRules
            }
        }
    )
}