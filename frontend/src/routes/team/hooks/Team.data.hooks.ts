import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useService} from "../../../util/hooks/observable";
import {teamService} from "../../../data/team/team.service";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";

export function useTeamDataLoader(run: NuzlockeRun): boolean {
    const teamLoading = useService(() => teamService.loadTeam$(run.id), [])
    const pokedexLoading = useService(() => pokedexService.loadPokedexData$(), [])
    const locationsLoading = useService(() => gamesService.loadGameLocations$(run.game), [])
    return teamLoading || pokedexLoading || locationsLoading
}
