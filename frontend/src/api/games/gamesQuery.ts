import {useQuery, UseQueryResult} from "react-query";
import {GamesListTO} from "./gamesTransfer";
import {loadGames} from "./gamesApi";

export function useGamesQuery(): UseQueryResult<GamesListTO> {
    return useQuery("/games", loadGames)
}
