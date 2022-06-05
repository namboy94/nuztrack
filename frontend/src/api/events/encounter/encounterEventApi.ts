import axios from "axios";
import {CreateEncounterEvent, EncounterEvent} from "./encounterEventTypes"

export function createEncounterEvent(runId: number, creator: CreateEncounterEvent): Promise<EncounterEvent> {
    return axios.post(`/api/events/${runId}/encounters`, creator).then(x => x.data)
}