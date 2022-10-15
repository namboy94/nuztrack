import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useQuery} from "../../../../util/hooks/observable";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {teamService} from "../../../../data/team/team.service";
import {TeamMember, TeamState} from "../../../../data/team/team.model";
import {ViewModel} from "../../../../util/viewmodel";
import {Pokedex} from "../../../../data/pokedex/pokedex.model";

export interface PokemonGridState {
    run: NuzlockeRun,
    pokedex: Pokedex,
    teamMembers: TeamMember[],
    teamState: TeamState
}

export interface PokemonGridInteractions {
    notify: NotificationFN
}

export type PokemonGridViewModel = ViewModel<PokemonGridState, PokemonGridInteractions>

export function usePokemonGridViewModel(
    run: NuzlockeRun, notify: NotificationFN, teamState: TeamState
): PokemonGridViewModel {
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const teamMembers = useQuery(
        () => teamService.getTeamMembersByState$(run.id, teamState), [], []
    )
    return {
        state: {
            run: run,
            pokedex: pokedex ?? Pokedex.EMPTY,
            teamMembers: teamMembers,
            teamState: teamState
        },
        interactions: {
            notify: notify
        }
    }
}