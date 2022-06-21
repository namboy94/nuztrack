import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {
    DeathEvent,
    EncounterEvent,
    Event,
    EventType,
    EvolutionEvent,
    MilestoneEvent,
    NoteEvent,
    TeamMemberSwitchEvent
} from "../../../data/events/events.model";
import {EncounterLogEntry} from "./EncounterLogEntry";
import {GameLocationRegistry} from "../../../data/games/games.model";
import {MilestoneLogEntry} from "./MilestoneLogEntry";
import {NoteLogEntry} from "./NoteLogEntry";
import {Team} from "../../../data/team/team.model";
import {TeamMemberSwitchLogEntry} from "./TeamMemberSwitchLogEntry";
import {DeathLogEntry} from "./DeathLogEntry";
import {EvolutionLogEntry} from "./EvolutionLogEntry";

export interface EventLogEntryProps {
    event: Event
    pokedex: Pokedex
    locationRegistry: GameLocationRegistry
    team: Team
}

export function EventLogEntry(props: EventLogEntryProps) {

    const {event, pokedex, locationRegistry, team} = props

    if (event.type === EventType.ENCOUNTER) {
        return <EncounterLogEntry event={event as EncounterEvent} pokedex={pokedex}/>
    } else if (event.type === EventType.MILESTONE) {
        return <MilestoneLogEntry event={event as MilestoneEvent} locationRegistry={locationRegistry}/>
    } else if (event.type === EventType.NOTE) {
        return <NoteLogEntry event={event as NoteEvent}/>
    } else if (event.type === EventType.TEAM_MEMBER_SWITCH) {
        return <TeamMemberSwitchLogEntry event={event as TeamMemberSwitchEvent} team={team} pokedex={pokedex}/>
    } else if (event.type === EventType.EVOLUTION) {
        return <EvolutionLogEntry event={event as EvolutionEvent} team={team} pokedex={pokedex}/>
    } else if (event.type === EventType.DEATH) {
        return <DeathLogEntry event={event as DeathEvent} team={team} pokedex={pokedex}/>
    } else {
        return <></>
    }
}