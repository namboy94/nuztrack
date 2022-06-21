import {teamApi} from "./team.api";
import {teamRepository} from "./team.repository";
import {ignoreElements, map, Observable, tap} from "rxjs";
import {teamConverter} from "./team.convert";
import {Team, TeamMember, TeamState} from "./team.model";

class TeamService {
    private api = teamApi
    private repo = teamRepository
    private converter = teamConverter

    loadTeam$(runId: number): Observable<never> {
        return this.api.getTeam$(runId).pipe(
            map(teamTO => this.converter.convertTeamToTeamMembers(teamTO, runId)),
            tap(teamMembers => this.repo.setTeamMembers(teamMembers)),
            ignoreElements()
        )
    }

    getTeam$(runId: number): Observable<Team> {
        return this.repo.queryTeamMembers$(runId).pipe(map(members => new Team(members)))
    }

    getActiveTeamMembers$(runId: number): Observable<TeamMember[]> {
        return this.repo.queryTeamMembersByTeamState$(runId, TeamState.ACTIVE)
    }

    getBoxedTeamMembers$(runId: number): Observable<TeamMember[]> {
        return this.repo.queryTeamMembersByTeamState$(runId, TeamState.BOXED)
    }

    getDeadTeamMembers$(runId: number): Observable<TeamMember[]> {
        return this.repo.queryTeamMembersByTeamState$(runId, TeamState.DEAD)
    }
}

export const teamService = new TeamService()