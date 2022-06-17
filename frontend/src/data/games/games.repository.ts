import {createStore} from '@ngneat/elf';
import {selectAllEntities, setEntities, upsertEntities, withEntities} from "@ngneat/elf-entities";
import {map, Observable} from "rxjs";
import {Game, GameLocation} from "./games.model";

interface GameLocationWrapper {
    location: GameLocation
    id: string
}


class GamesRepository {
    private gamesStore = createStore(
        {name: "games"},
        withEntities<Game, "key">({idKey: "key"})
    )

    private locationsStore = createStore(
        {name: "locations"},
        withEntities<GameLocationWrapper>()
    )

    private convertGameLocationToWrapper(gameLocation: GameLocation): GameLocationWrapper {
        return {location: gameLocation, id: this.generateIdForGameLocation(gameLocation)}
    }

    // noinspection JSMethodCanBeStatic
    private generateIdForGameLocation(gameLocation: GameLocation): string {
        return gameLocation.game.key + gameLocation.name
    }

    setGames(games: Game[]) {
        this.gamesStore.update(setEntities(games))
    }

    addGameLocations(gameLocations: GameLocation[]) {
        const wrapped: GameLocationWrapper[] = gameLocations.map(x => this.convertGameLocationToWrapper(x))
        this.locationsStore.update(upsertEntities(wrapped))
    }

    queryGames$(): Observable<Game[] | undefined> {
        return this.gamesStore.pipe(selectAllEntities())
    }

    queryGameLocations$(game: Game): Observable<GameLocation[]> {
        return this.locationsStore.pipe(
            selectAllEntities(),
            map(wrapped => wrapped.map(x => x.location).filter(x => x.game.key === game.key))
        )
    }
}

export const gamesRepository = new GamesRepository()
