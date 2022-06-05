import {useQuery, UseQueryResult} from "react-query";
import {EventLog} from "./eventTypes";
import {getEvents} from "./eventApi";

const EVENTS_KEY = "/events"

export function useEventsQuery(runId: number): UseQueryResult<EventLog> {
    return useQuery(`${EVENTS_KEY}/${runId}`, () => getEvents(runId))
}