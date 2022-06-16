import {pokedexApi} from "./pokedex.api";
import {pokedexRepository} from "./pokedex.repository";
import {pokedexConverter} from "./pokedex.convert";
import {ignoreElements, map, Observable, tap} from "rxjs";
import {Natures, Pokedex} from "./pokedex.model";

class PokedexService {
    private api = pokedexApi
    private repo = pokedexRepository
    private converter = pokedexConverter

    loadPokedexData$(): Observable<never> {
        return this.api.getPokedex$().pipe(
            map(pokedexTO => this.converter.convertPokedexTOToPokedexData(pokedexTO)),
            tap(pokedexData => this.repo.setPokedexData(pokedexData)),
            ignoreElements()
        )
    }

    loadNatures$(): Observable<never> {
        return this.api.getNatures$().pipe(
            map(naturesTO => this.converter.convertNaturesTOToModel(naturesTO)),
            tap(natures => this.repo.setNatures(natures)),
            ignoreElements()
        )
    }

    getPokedex$(): Observable<Pokedex | undefined> {
        return this.repo.queryPokedexData$().pipe(
            map(pokedexData => pokedexData === undefined ? undefined : new Pokedex(pokedexData))
        )
    }

    getNatures$(): Observable<Natures | undefined> {
        return this.repo.queryNatures$()
    }
}

export const pokedexService = new PokedexService()
