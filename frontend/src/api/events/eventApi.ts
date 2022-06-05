import axios from "axios";
import {EventLog} from "./eventTypes";

export function getEvents(runId: number): Promise<EventLog> {
    return axios.get(`/api/events/${runId}`).then(result => result.data)
}
