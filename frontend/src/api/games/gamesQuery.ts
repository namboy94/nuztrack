import {useQuery, UseQueryResult} from "react-query";
import {GameLocation, GamesList} from "./gamesTypes";
import {loadGames, loadLocations} from "./gamesApi";

const GAMES_KEY = "/games"

export function useGamesQuery(): UseQueryResult<GamesList> {
    return useQuery(GAMES_KEY, loadGames)
}

export function useLocationsQuery(gameTitle: string): UseQueryResult<GameLocation[]> {
    return useQuery(`${GAMES_KEY}/locations/${gameTitle}`, () => loadLocations(gameTitle))
}