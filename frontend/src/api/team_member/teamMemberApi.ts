import {Team} from "./teamMemberTypes";
import axios from "axios";

export function getTeam(runId: number): Promise<Team> {
    return axios.get(`/api/team/${runId}`).then(result => result.data)
}