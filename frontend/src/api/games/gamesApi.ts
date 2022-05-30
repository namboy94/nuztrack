import axios from "axios";
import {GamesList} from "./gamesTransfer";
import {convertGamesListTOToGamesList} from "./gamesConvert";

export function loadGames(): Promise<GamesList> {
    return axios.get("/games").then(x => convertGamesListTOToGamesList(x.data))
}