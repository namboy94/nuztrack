import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useService} from "../../../util/hooks/observable";
import {eventsService} from "../../../data/events/events.service";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";
import {teamService} from "../../../data/team/team.service";

export function useEventAdderDataLoader(run: NuzlockeRun): boolean {
    const eventsLoading = useService(() => eventsService.loadEvents$(run.id), [])
    const pokedexLoading = useService(() => pokedexService.loadPokedexData$(run.game), [])
    const naturesLoading = useService(() => pokedexService.loadNatures$(), [])
    const locationsLoading = useService(() => gamesService.loadGameLocations$(run.game), [])
    const teamLoading = useService(() => teamService.loadTeam$(run.id), [])
    return eventsLoading || pokedexLoading || naturesLoading || locationsLoading || teamLoading
}