import {map, Observable} from "rxjs";
import {TeamTO} from "./team.transfer";
import axios from "axios-observable";

class TeamApi {
    getTeam$(runId: number): Observable<TeamTO> {
        return axios.get(`/api/team/${runId}`).pipe(map(x => x.data))
    }
}

export const teamApi = new TeamApi()
