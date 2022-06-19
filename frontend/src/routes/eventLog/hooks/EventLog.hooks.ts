import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useService} from "../../../util/observable.hooks";
import {eventsService} from "../../../data/events/events.service";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";

export function useEventLogDataLoader(run: NuzlockeRun) {
    const eventsLoading = useService(() => eventsService.loadEvents$(run.id), [])
    const pokedexLoading = useService(() => pokedexService.loadPokedexData$(), [])
    const locationsLoading = useService(() => gamesService.loadGameLocations$(run.game), [])
    return eventsLoading || pokedexLoading || locationsLoading
}