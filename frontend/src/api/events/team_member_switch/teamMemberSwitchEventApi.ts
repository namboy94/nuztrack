import axios from "axios";
import {CreateTeamMemberSwitchEvent, TeamMemberSwitchEvent} from "./teamMemberSwitchEventTypes";

export function createTeamMemberSwitchEvent(
    runId: number, creator: CreateTeamMemberSwitchEvent
): Promise<TeamMemberSwitchEvent> {
    return axios.post(`/api/events/${runId}/team_member_switches`, creator).then(x => x.data)
}