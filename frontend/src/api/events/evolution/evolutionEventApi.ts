import axios from "axios";
import {CreateEvolutionEvent, EvolutionEvent} from "./evolutionEventTypes";

export function createEvolutionEvent(runId: number, creator: CreateEvolutionEvent): Promise<EvolutionEvent> {
    return axios.post(`/api/events/${runId}/evolutions`, creator).then(x => x.data)
}