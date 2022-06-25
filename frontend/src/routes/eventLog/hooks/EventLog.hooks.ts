import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useQuery} from "../../../util/observable.hooks";
import {eventsService} from "../../../data/events/events.service";
import {EventLogProps} from "../components/EventLog";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";
import {teamService} from "../../../data/team/team.service";

export function useEventLogProps(run: NuzlockeRun): EventLogProps {
    const eventRegistry = useQuery(() => eventsService.getEventRegistry$(run.id), undefined, [])
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const team = useQuery(() => teamService.getTeam$(run.id), undefined, [])
    const locationRegistry = useQuery(
        () => gamesService.getGameLocationRegistry$(run.game), undefined, []
    )
    return {
        eventRegistry: eventRegistry,
        pokedex: pokedex,
        locationRegistry: locationRegistry,
        team: team
    }
}
