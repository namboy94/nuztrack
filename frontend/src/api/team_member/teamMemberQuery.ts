import {useQuery} from "react-query";
import {getTeam} from "./teamMemberApi";

const TEAM_KEY = "/team"

export function useTeamQuery(runId: number) {
    return useQuery(TEAM_KEY + `/${runId}`, () => getTeam(runId))
}
