import axios from "axios-observable";
import {map, Observable} from "rxjs";
import {GameListTO, GameLocationTO} from "./games.transfer";

class GamesApi {
    getGameList$(): Observable<GameListTO> {
        return axios.get("/api/games").pipe(map(x => x.data))
    }

    getGameLocations$(gameKey: string): Observable<GameLocationTO[]> {
        return axios.get(`/api/games/${gameKey}/locations`).pipe(map(x => x.data))
    }
}

export const gamesApi = new GamesApi()