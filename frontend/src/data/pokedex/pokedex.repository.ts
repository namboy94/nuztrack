import {Natures, PokedexData} from "./pokedex.model";
import {createStore} from "@ngneat/elf";
import {selectEntity, setEntities, withEntities} from "@ngneat/elf-entities";
import {map, Observable} from "rxjs";

interface PokedexDataWrapper {
    id: number,
    data: PokedexData
}

interface NaturesWrapper {
    id: number,
    data: Natures
}

class PokedexRepository {

    private pokedexDataStore = createStore(
        {name: "pokedexData"},
        withEntities<PokedexDataWrapper>()
    )

    private naturesStore = createStore(
        {name: "natures"},
        withEntities<NaturesWrapper>()
    )

    setPokedexData(pokedexData: PokedexData) {
        const data: PokedexDataWrapper = {id: 1, data: pokedexData}
        this.pokedexDataStore.update(setEntities([data]))
    }

    setNatures(natures: Natures) {
        const data: NaturesWrapper = {id: 1, data: natures}
        this.naturesStore.update(setEntities([data]))
    }

    queryPokedexData$(): Observable<PokedexData | undefined> {
        return this.pokedexDataStore.pipe(
            selectEntity(1),
            map(wrapper => wrapper?.data)
        )
    }

    queryNatures$(): Observable<Natures | undefined> {
        return this.naturesStore.pipe(
            selectEntity(1),
            map(wrapper => wrapper?.data)
        )
    }

}

export const pokedexRepository = new PokedexRepository()