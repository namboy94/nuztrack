import {createStore} from '@ngneat/elf';
import {selectAllEntities, selectEntity, setEntities, upsertEntities, withEntities} from "@ngneat/elf-entities";
import {map, Observable} from "rxjs";
import {GameList, GameLocation} from "./games.model";

interface GameListWrapper {
    gameList: GameList
    id: number
}

interface GameLocationWrapper {
    location: GameLocation
    id: string
}


class GamesRepository {
    private gameListStore = createStore(
        {name: "games"},
        withEntities<GameListWrapper>()
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
        return gameLocation.gameKey + gameLocation.name
    }

    setGameList(gameList: GameList) {
        this.gameListStore.update(setEntities([{gameList: gameList, id: 1}]))
    }

    addGameLocations(gameLocations: GameLocation[]) {
        const wrapped: GameLocationWrapper[] = gameLocations.map(x => this.convertGameLocationToWrapper(x))
        this.locationsStore.update(upsertEntities(wrapped))
    }

    queryGameList$(): Observable<GameList | undefined> {
        return this.gameListStore.pipe(selectEntity(1), map(x => x?.gameList))
    }

    queryGameLocations$(gameKey: string): Observable<GameLocation[]> {
        return this.locationsStore.pipe(
            selectAllEntities(),
            map(wrapped => wrapped.map(x => x.location).filter(x => x.gameKey === gameKey))
        )
    }
}

export const gamesRepository = new GamesRepository()
