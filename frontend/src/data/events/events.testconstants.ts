import {
    CreateDeathEventTO,
    CreateEncounterEventTO,
    CreateEvolutionEventTO,
    CreateMilestoneEventTO,
    CreateNoteEventTO,
    CreateTeamMemberSwitchEventTO,
    DeathEventTO,
    EncounterEventTO,
    EventLogTO,
    EvolutionEventTO,
    MilestoneEventTO,
    NoteEventTO,
    TeamMemberSwitchEventTO
} from "./events.transfer";
import {
    CreateDeathEvent,
    CreateEncounterEvent,
    CreateEvolutionEvent,
    CreateMilestoneEvent,
    CreateNoteEvent,
    CreateTeamMemberSwitchEvent,
    DeathEvent,
    EncounterEvent,
    Event,
    EventRegistry,
    EventType,
    EvolutionEvent,
    MilestoneEvent,
    NoteEvent,
    SwitchType,
    TeamMemberSwitchEvent
} from "./events.model";
import {Gender} from "../team/team.model";

export const ENCOUNTER_EVENT_SUCCESSFUL_TO: EncounterEventTO = {
    event: {
        id: 1,
        runId: 1,
        location: "Pallet Town",
        timestamp: "2022-03-15T20:05:10.324Z"
    },
    caught: true,
    level: 5,
    pokedexNumber: 7,
    teamMemberId: 1
}
export const ENCOUNTER_EVENT_SUCCESSFUL: EncounterEvent = {
    id: 1,
    runId: 1,
    location: "Pallet Town",
    timestamp: new Date("2022-03-15T20:05:10.324Z"),
    caught: true,
    level: 5,
    pokedexNumber: 7,
    teamMemberId: 1,
    type: EventType.ENCOUNTER
}

export const ENCOUNTER_EVENT_FAILED_TO: EncounterEventTO = {
    event: {
        id: 2,
        runId: 1,
        location: "Route 1",
        timestamp: "2022-03-15T20:05:10.324Z"
    },
    caught: false,
    level: 3,
    pokedexNumber: 16,
    teamMemberId: null
}
export const ENCOUNTER_EVENT_FAILED: EncounterEvent = {
    id: 2,
    runId: 1,
    location: "Route 1",
    timestamp: new Date("2022-03-15T20:05:10.324Z"),
    caught: false,
    level: 3,
    pokedexNumber: 16,
    teamMemberId: null,
    type: EventType.ENCOUNTER
}
export const CREATE_ENCOUNTER_EVENT_TO: CreateEncounterEventTO = {
    caught: true,
    level: 5,
    location: "Pallet Town",
    pokedexNumber: 7,
    pokemon: {
        nickname: "Squirtle",
        gender: "MALE",
        nature: "MODEST",
        abilitySlot: 1
    }
}
export const CREATE_ENCOUNTER_EVENT: CreateEncounterEvent = {
    caught: true,
    level: 5,
    location: "Pallet Town",
    pokedexNumber: 7,
    pokemon: {
        nickname: "Squirtle",
        gender: Gender.MALE,
        nature: "MODEST",
        abilitySlot: 1
    }
}
export const DEATH_EVENT_TO: DeathEventTO = {
    event: {
        id: 3,
        runId: 1,
        location: "Route 2",
        timestamp: "2022-03-16T20:05:10.324Z"
    },
    description: "Died",
    level: 7,
    opponent: "Wild Rattata",
    teamMemberId: 1
}
export const DEATH_EVENT: DeathEvent = {
    id: 3,
    runId: 1,
    location: "Route 2",
    timestamp: new Date("2022-03-16T20:05:10.324Z"),
    description: "Died",
    level: 7,
    opponent: "Wild Rattata",
    teamMemberId: 1,
    type: EventType.DEATH
}
export const CREATE_DEATH_EVENT_TO: CreateDeathEventTO = {
    location: "Route 2",
    description: "Died",
    level: 7,
    opponent: "Wild Rattata",
    teamMemberId: 1
}
export const CREATE_DEATH_EVENT: CreateDeathEvent = {
    location: "Route 2",
    description: "Died",
    level: 7,
    opponent: "Wild Rattata",
    teamMemberId: 1
}
export const EVOLUTION_EVENT_TO: EvolutionEventTO = {
    event: {
        id: 4,
        runId: 1,
        location: "Viridian Forest",
        timestamp: "2022-03-17T20:05:10.324Z"
    },
    level: 16,
    newPokedexNumber: 8,
    previousPokedexNumber: 7,
    teamMemberId: 1
}
export const EVOLUTION_EVENT: EvolutionEvent = {
    id: 4,
    runId: 1,
    location: "Viridian Forest",
    timestamp: new Date("2022-03-17T20:05:10.324Z"),
    level: 16,
    newPokedexNumber: 8,
    previousPokedexNumber: 7,
    teamMemberId: 1,
    type: EventType.EVOLUTION
}
export const CREATE_EVOLUTION_EVENT_TO: CreateEvolutionEventTO = {
    level: 16,
    location: "Viridian Forest",
    newPokedexNumber: 8,
    teamMemberId: 1
}
export const CREATE_EVOLUTION_EVENT: CreateEvolutionEvent = {
    level: 16,
    location: "Viridian Forest",
    newPokedexNumber: 8,
    teamMemberId: 1
}
export const MILESTONE_EVENT_TO: MilestoneEventTO = {
    event: {
        id: 5,
        runId: 1,
        location: "Pewter City",
        timestamp: "2022-03-18T20:05:10.324Z"
    },
    milestone: "Boulder Badge"
}
export const MILESTONE_EVENT: MilestoneEvent = {
    id: 5,
    runId: 1,
    location: "Pewter City",
    timestamp: new Date("2022-03-18T20:05:10.324Z"),
    milestone: "Boulder Badge",
    type: EventType.MILESTONE
}
export const CREATE_MILESTONE_EVENT_TO: CreateMilestoneEventTO = {
    location: "Pewter City",
    milestone: "Boulder Badge"
}
export const CREATE_MILESTONE_EVENT: CreateMilestoneEvent = {
    location: "Pewter City",
    milestone: "Boulder Badge"
}
export const NOTE_EVENT_TO: NoteEventTO = {
    event: {
        id: 6,
        runId: 1,
        location: "Route 3",
        timestamp: "2022-03-19T20:05:10.324Z"
    },
    text: "This is a note"
}
export const NOTE_EVENT: NoteEvent = {
    id: 6,
    runId: 1,
    location: "Route 3",
    timestamp: new Date("2022-03-19T20:05:10.324Z"),
    text: "This is a note",
    type: EventType.NOTE
}
export const CREATE_NOTE_EVENT_TO: CreateNoteEventTO = {
    location: "Route 3",
    text: "This is a note"
}
export const CREATE_NOTE_EVENT: CreateNoteEvent = {
    location: "Route 3",
    text: "This is a note"
}
export const TEAM_MEMBER_SWITCH_EVENT_TO: TeamMemberSwitchEventTO = {
    event: {
        id: 7,
        runId: 1,
        location: "Mt. Moon",
        timestamp: "2022-03-20T20:05:10.324Z"
    },
    switchType: "ADD",
    teamMemberId: 2
}
export const TEAM_MEMBER_SWITCH_EVENT: TeamMemberSwitchEvent = {
    id: 7,
    runId: 1,
    location: "Mt. Moon",
    timestamp: new Date("2022-03-20T20:05:10.324Z"),
    switchType: SwitchType.ADD,
    teamMemberId: 2,
    type: EventType.TEAM_MEMBER_SWITCH
}
export const TEAM_MEMBER_SWITCH_REMOVE_EVENT_TO: TeamMemberSwitchEventTO = {
    event: {
        id: 8,
        runId: 1,
        location: "Pewter City",
        timestamp: "2022-03-20T20:04:10.324Z"
    },
    switchType: "REMOVE",
    teamMemberId: 1
}
export const TEAM_MEMBER_SWITCH_REMOVE_EVENT: TeamMemberSwitchEvent = {
    id: 8,
    runId: 1,
    location: "Pewter City",
    timestamp: new Date("2022-03-20T20:04:10.324Z"),
    switchType: SwitchType.REMOVE,
    teamMemberId: 1,
    type: EventType.TEAM_MEMBER_SWITCH
}
export const CREATE_TEAM_MEMBER_SWITCH_EVENT_TO: CreateTeamMemberSwitchEventTO = {
    location: "Mt. Moon",
    switchType: "ADD",
    teamMemberId: 2
}
export const CREATE_TEAM_MEMBER_SWITCH_EVENT: CreateTeamMemberSwitchEvent = {
    location: "Mt. Moon",
    switchType: SwitchType.ADD,
    teamMemberId: 2
}
export const EVENT_LOG_TO: EventLogTO = {
    deaths: [DEATH_EVENT_TO],
    encounters: [ENCOUNTER_EVENT_SUCCESSFUL_TO, ENCOUNTER_EVENT_FAILED_TO],
    evolutions: [EVOLUTION_EVENT_TO],
    milestones: [MILESTONE_EVENT_TO],
    notes: [NOTE_EVENT_TO],
    teamMemberSwitches: [TEAM_MEMBER_SWITCH_EVENT_TO, TEAM_MEMBER_SWITCH_REMOVE_EVENT_TO]
}
export const EVENT_LIST: Event[] = [
    DEATH_EVENT,
    ENCOUNTER_EVENT_SUCCESSFUL, ENCOUNTER_EVENT_FAILED,
    EVOLUTION_EVENT,
    MILESTONE_EVENT,
    NOTE_EVENT,
    TEAM_MEMBER_SWITCH_EVENT, TEAM_MEMBER_SWITCH_REMOVE_EVENT
]
export const EVENT_REGISTRY = new EventRegistry(EVENT_LIST)