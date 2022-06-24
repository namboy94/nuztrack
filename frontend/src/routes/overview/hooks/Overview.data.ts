import {useService} from "../../../util/observable.hooks";
import {gamesService} from "../../../data/games/games.service";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {eventsService} from "../../../data/events/events.service";

export function useOverviewDataLoader(run: NuzlockeRun): boolean {
    const locationsLoading = useService(() => gamesService.loadGameLocations$(run.game), [])
    const eventsLoading = useService(() => eventsService.loadEvents$(run.id), [])
    return eventsLoading || locationsLoading
}