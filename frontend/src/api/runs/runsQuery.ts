import {useQuery, useQueryClient, UseQueryResult} from "react-query";
import {loadRun, loadRuns} from "./runsApi";
import {NuzlockeRun} from "./runsTypes";

export const QUERY_RUNS_KEY = "/runs"

export function useRunQuery(runId: number): UseQueryResult<NuzlockeRun | null> {
    return useQuery(`${QUERY_RUNS_KEY}/${runId}`, () => loadRun(runId))
}

export function useRunsQuery(): UseQueryResult<NuzlockeRun[]> {
    return useQuery(QUERY_RUNS_KEY, loadRuns)
}

export function useInvalidateRunsQuery() {
    const client = useQueryClient()
    return () => client.invalidateQueries(QUERY_RUNS_KEY)
}
