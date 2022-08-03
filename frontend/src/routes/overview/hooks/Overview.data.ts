import {useService} from "../../../util/hooks/observable";
import {gamesService} from "../../../data/games/games.service";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {eventsService} from "../../../data/events/events.service";
import {teamService} from "../../../data/team/team.service";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {runsService} from "../../../data/runs/runs.service";

export function useOverviewDataLoader(run: NuzlockeRun): boolean {
    const locationsLoading = useService(() => gamesService.loadGameLocations$(run.game), [])
    const eventsLoading = useService(() => eventsService.loadEvents$(run.id), [])
    const teamLoading = useService(() => teamService.loadTeam$(run.id), [])
    const pokedexLoading = useService(() => pokedexService.loadPokedexData$(), [])
    const gamesLoading = useService(() => gamesService.loadGames$(), [])
    const multiRunOptionsLoading = useService(() => runsService.loadMultiRunOptions$(), [])
    return eventsLoading || locationsLoading || teamLoading || pokedexLoading || gamesLoading || multiRunOptionsLoading
}