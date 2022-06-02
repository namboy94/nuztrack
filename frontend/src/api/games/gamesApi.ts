import axios from "axios";
import {GamesList} from "./gamesTypes";

export function loadGames(): Promise<GamesList> {
    return axios.get("/games").then(
        x => new Map<string, string>(Object.entries(x.data))
    )
}