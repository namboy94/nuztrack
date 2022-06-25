import {useService} from "../../../util/observable.hooks";
import {gamesService} from "../../../data/games/games.service";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {eventsService} from "../../../data/events/events.service";
import {teamService} from "../../../data/team/team.service";
import {pokedexService} from "../../../data/pokedex/pokedex.service";

export function useOverviewDataLoader(run: NuzlockeRun): boolean {
    const locationsLoading = useService(() => gamesService.loadGameLocations$(run.game), [])
    const eventsLoading = useService(() => eventsService.loadEvents$(run.id), [])
    const teamLoading = useService(() => teamService.loadTeam$(run.id), [])
    const pokedexLoading = useService(() => pokedexService.loadPokedexData$(), [])
    return eventsLoading || locationsLoading
}