import {useQuery, UseQueryResult} from "react-query";
import {GamesList} from "./gamesTransfer";
import {loadGames} from "./gamesApi";

export function useGamesQuery(): UseQueryResult<GamesList> {
    return useQuery("/games", loadGames)
}
