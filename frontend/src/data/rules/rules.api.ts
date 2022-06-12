import {map, Observable} from "rxjs";
import {RulesDetailsTO} from "./rules.transfer";
import axios from "axios-observable";

class RulesApi {
    getRulesDetails$(): Observable<RulesDetailsTO> {
        return axios.get("/api/rules").pipe(map(x => x.data))
    }
}

export const rulesApi = new RulesApi()