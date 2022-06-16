import {TeamMemberTO, TeamTO} from "./team.transfer";
import {Gender, TeamMember, TeamState} from "./team.model";

class TeamConverter {
    convertTeamToTeamMembers(to: TeamTO, runId: number): TeamMember[] {
        return [
            ...to.active.map(x => this.convertTeamMemberTOToModel(x, TeamState.ACTIVE, runId)),
            ...to.boxed.map(x => this.convertTeamMemberTOToModel(x, TeamState.BOXED, runId)),
            ...to.dead.map(x => this.convertTeamMemberTOToModel(x, TeamState.DEAD, runId)),
        ]
    }

    convertTeamMemberTOToModel(to: TeamMemberTO, teamState: TeamState, runId: number): TeamMember {
        return {
            ...to,
            gender: Gender[to.gender as keyof typeof Gender],
            teamState: teamState,
            runId: runId
        }
    }
}

export const teamConverter = new TeamConverter()