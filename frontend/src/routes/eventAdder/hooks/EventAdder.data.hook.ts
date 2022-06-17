import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useService} from "../../../util/observable.hooks";
import {eventsService} from "../../../data/events/events.service";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";

export function useEventAdderDataLoader(run: NuzlockeRun): boolean {
    const eventsLoading = useService(() => eventsService.loadEvents$(run.id), [])
    const pokedexLoading = useService(() => pokedexService.loadPokedexData$(), [])
    const naturesLoading = useService(() => pokedexService.loadNatures$(), [])
    const locationsLoading = useService(() => gamesService.loadGameLocations$(run.game), [])
    return eventsLoading || pokedexLoading || naturesLoading || locationsLoading
}