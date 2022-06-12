import {rulesApi} from "./rules.api";
import {rulesRepository} from "./rules.repository";
import {rulesConverter} from "./rules.convert";
import {ignoreElements, map, Observable, tap} from "rxjs";
import {RulesDetails} from "./rules.model";

class RulesService {
    private api = rulesApi
    private repo = rulesRepository
    private converter = rulesConverter

    loadRulesDetails$(): Observable<never> {
        return this.api.getRulesDetails$().pipe(
            map(rulesDetailsTO => this.converter.convertRulesDetailsTOToModel(rulesDetailsTO)),
            tap(rulesDetails => this.repo.setRulesDetails(rulesDetails)),
            ignoreElements()
        )
    }

    getRulesDetails$(): Observable<RulesDetails | undefined> {
        return this.repo.queryRulesDetails$()
    }

}

export const rulesService = new RulesService()