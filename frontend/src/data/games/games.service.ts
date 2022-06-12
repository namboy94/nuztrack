import {gamesApi} from "./games.api";
import {gamesRepository} from "./games.repository";
import {gamesConverter} from "./games.convert";
import {ignoreElements, map, Observable, tap} from "rxjs";
import {GameList, GameLocation} from "./games.model";

class GamesService {
    private api = gamesApi
    private repo = gamesRepository
    private converter = gamesConverter

    loadGameList$(): Observable<never> {
        return this.api.getGameList$().pipe(
            map(gameListTO => this.converter.convertGameListTOToModel(gameListTO)),
            tap(gameList => this.repo.setGameList(gameList)),
            ignoreElements()
        )
    }

    loadGameLocations$(gameKey: string): Observable<never> {
        return this.api.getGameLocations$(gameKey).pipe(
            map(gameLocationTOs => gameLocationTOs.map(x => this.converter.convertGameLocationTOToModel(x))),
            tap(gameLocations => this.repo.addGameLocations(gameLocations)),
            ignoreElements()
        )
    }

    getGameList$(): Observable<GameList | undefined> {
        return this.repo.queryGameList$()
    }

    getGameLocations$(gameKey: string): Observable<GameLocation[]> {
        return this.repo.queryGameLocations$(gameKey)
    }

}

export const gamesService = new GamesService()
