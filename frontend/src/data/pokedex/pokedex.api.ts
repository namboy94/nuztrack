import {map, Observable} from "rxjs";
import {NaturesTO, PokedexTO} from "./pokedex.transfer";
import axios from "axios-observable";
import {Game} from "../games/games.model";

class PokedexApi {
    getPokedex$(game: Game): Observable<PokedexTO> {
        return axios.get(`/api/pokedex?game=${game.key}`).pipe(map(x => x.data))
    }

    getNatures$(): Observable<NaturesTO> {
        return axios.get("/api/pokedex/natures").pipe(map(x => x.data))
    }
}

export const pokedexApi = new PokedexApi()