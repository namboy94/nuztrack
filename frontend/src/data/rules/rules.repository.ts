import {RulesDetails} from "./rules.model";
import {createStore} from "@ngneat/elf";
import {selectEntity, setEntities, withEntities} from "@ngneat/elf-entities";
import {map, Observable} from "rxjs";

interface RulesDetailsWrapper {
    details: RulesDetails
    id: number
}

class RulesRepository {
    private rulesDetailsStore = createStore(
        {name: "rules"},
        withEntities<RulesDetailsWrapper>()
    )

    setRulesDetails(rulesDetails: RulesDetails) {
        const wrapped: RulesDetailsWrapper = {id: 1, details: rulesDetails}
        this.rulesDetailsStore.update(setEntities([wrapped]))
    }

    queryRulesDetails$(): Observable<RulesDetails | undefined> {
        return this.rulesDetailsStore.pipe(
            selectEntity(1),
            map(x => x?.details)
        )
    }
}

export const rulesRepository = new RulesRepository()
