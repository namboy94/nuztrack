import axios from "axios";
import {GamesListTO} from "./gamesTransfer";

export function loadGames(): Promise<GamesListTO> {
    return axios.get("/games").then(x => x.data)
}