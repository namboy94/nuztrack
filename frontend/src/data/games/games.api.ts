import axios from "axios-observable";
import {map, Observable} from "rxjs";
import {GameLocationTO, GameTO} from "./games.transfer";

class GamesApi {
    getGames$(): Observable<GameTO[]> {
        return axios.get("/api/games").pipe(map(x => x.data))
    }

    getGameLocations$(gameKey: string): Observable<GameLocationTO[]> {
        return axios.get(`/api/games/${gameKey}/locations`).pipe(map(x => x.data))
    }
}

export const gamesApi = new GamesApi()