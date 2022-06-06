import axios from "axios";
import {CreateDeathEvent, DeathEvent} from "./deathEventTypes";

export function createDeathEvent(runId: number, creator: CreateDeathEvent): Promise<DeathEvent> {
    return axios.post(`/api/events/${runId}/deaths`, creator).then(x => x.data)
}