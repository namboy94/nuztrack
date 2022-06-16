import {map, Observable} from "rxjs";
import {NaturesTO, PokedexTO} from "./pokedex.transfer";
import axios from "axios-observable";

class PokedexApi {
    getPokedex$(): Observable<PokedexTO> {
        return axios.get("/api/pokedex").pipe(map(x => x.data))
    }

    getNatures$(): Observable<NaturesTO> {
        return axios.get("/api/pokedex/natures").pipe(map(x => x.data))
    }
}

export const pokedexApi = new PokedexApi()