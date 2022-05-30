import {GamesListTO, GamesList} from "./gamesTransfer";

export function convertGamesListTOToGamesList(gamesListTO: GamesListTO): GamesList {
    const gamesMapping = new Map<string, string>(Object.entries(gamesListTO.games))
    return {games: gamesMapping}
}