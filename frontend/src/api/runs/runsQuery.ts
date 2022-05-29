import {useQuery, useQueryClient, UseQueryResult} from "react-query";
import {loadRun, loadRuns} from "./runsApi";
import {NuzlockeRunTO} from "./runsTransfer";

export const QUERY_RUNS_KEY = "/runs"

export function useRunQuery(runId: number): UseQueryResult<NuzlockeRunTO | undefined> {
    return useQuery(`${QUERY_RUNS_KEY}/${runId}`, () => loadRun(runId))
}

export function useRunsQuery(): UseQueryResult<NuzlockeRunTO[]> {
    return useQuery(QUERY_RUNS_KEY, loadRuns)
}

export function useInvalidateRunsQuery() {
    const client = useQueryClient()
    return () => client.invalidateQueries(QUERY_RUNS_KEY)
}
