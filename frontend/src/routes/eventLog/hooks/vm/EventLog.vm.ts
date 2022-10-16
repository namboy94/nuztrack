import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {useQuery} from "../../../../util/hooks/observable";
import {eventsService} from "../../../../data/events/events.service";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../../data/games/games.service";
import {teamService} from "../../../../data/team/team.service";
import {ViewModel} from "../../../../util/viewmodel";
import {EventRegistry} from "../../../../data/events/events.model";
import {Pokedex} from "../../../../data/pokedex/pokedex.model";
import {GameLocationRegistry} from "../../../../data/games/games.model";
import {Team} from "../../../../data/team/team.model";

export interface EventLogState {
    eventRegistry: EventRegistry,
    pokedex: Pokedex,
    locationRegistry: GameLocationRegistry,
    team: Team
}

export interface EventLogInteractions {

}

export type EventLogViewModel = ViewModel<EventLogState, EventLogInteractions>

export function useEventLogViewModel(run: NuzlockeRun): EventLogViewModel {
    const eventRegistry = useQuery(() => eventsService.getEventRegistry$(run.id), undefined, [])
    const pokedex = useQuery(() => pokedexService.getPokedex$(run.game), undefined, [])
    const team = useQuery(() => teamService.getTeam$(run.id), undefined, [])
    const locationRegistry = useQuery(
        () => gamesService.getGameLocationRegistry$(run.game), undefined, []
    )
    return {
        state: {
            eventRegistry: eventRegistry ?? new EventRegistry([]),
            pokedex: pokedex ?? Pokedex.EMPTY,
            locationRegistry: locationRegistry ?? new GameLocationRegistry([]),
            team: team ?? new Team([])
        },
        interactions: {}
    }
}
