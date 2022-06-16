import {createStore} from "@ngneat/elf";
import {addEntities, selectAllEntitiesApply, setEntities, withEntities} from "@ngneat/elf-entities";
import {TeamMember, TeamState} from "./team.model";
import {Observable} from "rxjs";

class TeamRepository {
    private teamMemberStore = createStore(
        {name: "teamMembers"},
        withEntities<TeamMember, "id">({idKey: "id"})
    )

    setTeamMembers(teamMembers: TeamMember[]) {
        this.teamMemberStore.update(setEntities(teamMembers))
    }

    addTeamMember(teamMember: TeamMember) {
        this.teamMemberStore.update(addEntities(teamMember))
    }

    queryTeamMembers$(runId: number): Observable<TeamMember[]> {
        return this.teamMemberStore.pipe(selectAllEntitiesApply({
            filterEntity: e => e.runId === runId
        }))
    }

    queryTeamMembersByTeamState$(runId: number, teamState: TeamState): Observable<TeamMember[]> {
        return this.teamMemberStore.pipe(selectAllEntitiesApply({
            filterEntity: e => e.runId === runId && e.teamState == teamState
        }))
    }
}

export const teamRepository = new TeamRepository()