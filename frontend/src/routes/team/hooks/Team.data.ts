import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useService} from "../../../util/observable.hooks";
import {teamService} from "../../../data/team/team.service";
import {pokedexService} from "../../../data/pokedex/pokedex.service";

export function useTeamDataLoader(run: NuzlockeRun): boolean {
    const teamLoading = useService(() => teamService.loadTeam$(run.id), [])
    const pokedexLoading = useService(() => pokedexService.loadPokedexData$(), [])
    return teamLoading || pokedexLoading
}
