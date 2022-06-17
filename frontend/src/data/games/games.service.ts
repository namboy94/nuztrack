import {gamesApi} from "./games.api";
import {gamesRepository} from "./games.repository";
import {gamesConverter} from "./games.convert";
import {ignoreElements, map, Observable, tap} from "rxjs";
import {Game, GameLocation} from "./games.model";

class GamesService {
    private api = gamesApi
    private repo = gamesRepository
    private converter = gamesConverter

    loadGames$(): Observable<never> {
        return this.api.getGames$().pipe(
            map(gameTOs => gameTOs.map(gameTO => this.converter.convertGameTOToModel(gameTO))),
            tap(games => this.repo.setGames(games)),
            ignoreElements()
        )
    }

    loadGameLocations$(game: Game): Observable<never> {
        return this.api.getGameLocations$(game.key).pipe(
            map(gameLocationTOs => gameLocationTOs.map(x => this.converter.convertGameLocationTOToModel(x))),
            tap(gameLocations => this.repo.addGameLocations(gameLocations)),
            ignoreElements()
        )
    }

    getGames$(): Observable<Game[] | undefined> {
        return this.repo.queryGames$()
    }

    getGameLocations$(game: Game): Observable<GameLocation[]> {
        return this.repo.queryGameLocations$(game)
    }

}

export const gamesService = new GamesService()
