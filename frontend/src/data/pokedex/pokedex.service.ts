import {pokedexApi} from "./pokedex.api";
import {pokedexRepository} from "./pokedex.repository";
import {pokedexConverter} from "./pokedex.convert";
import {ignoreElements, map, Observable, tap} from "rxjs";
import {Natures, Pokedex} from "./pokedex.model";
import {Game} from "../games/games.model";

class PokedexService {
    private api = pokedexApi
    private repo = pokedexRepository
    private converter = pokedexConverter

    loadPokedexData$(game: Game): Observable<never> {
        return this.api.getPokedex$(game).pipe(
            map(pokedexTO => this.converter.convertPokedexTOToPokedexData(pokedexTO)),
            tap(pokedexData => this.repo.setPokedexData(pokedexData, game)),
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

    getPokedex$(game: Game): Observable<Pokedex | undefined> {
        return this.repo.queryPokedexData$(game).pipe(
            map(pokedexData => pokedexData === undefined ? undefined : new Pokedex(pokedexData))
        )
    }

    getNatures$(): Observable<Natures | undefined> {
        return this.repo.queryNatures$()
    }
}

export const pokedexService = new PokedexService()
