import axios from "axios";
import {GamesList, Location} from "./gamesTypes";

export function loadGames(): Promise<GamesList> {
    return axios.get("/api/games").then(
        x => new Map<string, string>(Object.entries(x.data))
    )
}

export function loadLocations(gameTitle: string): Promise<Location> {
    return axios.get(`/api/games/${gameTitle}/locations`).then(x => x.data)
}
