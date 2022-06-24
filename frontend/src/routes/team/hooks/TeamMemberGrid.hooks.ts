import {TeamMemberGridProps} from "../components/TeamMemberGrid";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../global/Snackbar";
import {useQuery} from "../../../util/observable.hooks";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {teamService} from "../../../data/team/team.service";
import {TeamMember, TeamState} from "../../../data/team/team.model";

export function usePokemonGridProps(run: NuzlockeRun, notify: NotificationFN, state: TeamState): TeamMemberGridProps {
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const teamMembers =
        useQuery(() => teamService.getTeamMembersByState$(run.id, state), [], [])
    return {
        pokedex: pokedex,
        teamMembers: teamMembers,
        state: state,
        movePokemon: (teamMember: TeamMember) => console.log(teamMember.nickname),
        showDetails: (teamMember: TeamMember) => console.log(teamMember.nickname)
    }
}