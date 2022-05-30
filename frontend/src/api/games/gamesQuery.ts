import {useQuery, UseQueryResult} from "react-query";
import {GamesList} from "./gamesTypes";
import {loadGames} from "./gamesApi";

const GAMES_KEY = "/games"

export function useGamesQuery(): UseQueryResult<GamesList> {
    return useQuery(GAMES_KEY, loadGames)
}
