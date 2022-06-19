import {Gender} from "../team/team.model";

export enum SwitchType {
    ADD,
    REMOVE
}

export enum EventType {
    ENCOUNTER,
    DEATH,
    EVOLUTION,
    MILESTONE,
    NOTE,
    TEAM_MEMBER_SWITCH
}

export interface Event {
    id: number
    type: EventType
    runId: number
    timestamp: Date
    location: string
}

export interface EncounterEvent extends Event {
    pokedexNumber: number
    level: number
    caught: boolean
    teamMemberId: number | null
}

export interface CreateEncounterEvent {
    location: string
    pokedexNumber: number
    level: number
    caught: boolean
    pokemon: CreateEncounterPokemon
}

export interface CreateEncounterPokemon {
    nickname: string
    gender: Gender | null
    nature: string | null
    abilitySlot: number | null
}

export interface DeathEvent extends Event {
    teamMemberId: number
    level: number
    opponent: string
    description: string
}

export interface CreateDeathEvent {
    location: string
    teamMemberId: number
    level: number
    opponent: string
    description: string
}

export interface EvolutionEvent extends Event {
    teamMemberId: number
    level: number
    previousPokedexNumber: number
    newPokedexNumber: number
}

export interface CreateEvolutionEvent {
    location: string
    teamMemberId: number
    level: number
    newPokedexNumber: number
}

export interface NoteEvent extends Event {
    text: string
}

export interface CreateNoteEvent {
    location: string
    text: string
}

export interface MilestoneEvent extends Event {
    milestone: string
}

export interface CreateMilestoneEvent {
    location: string
    milestone: string
}

export interface TeamMemberSwitchEvent extends Event {
    teamMemberId: number
    switchType: SwitchType
}

export interface CreateTeamMemberSwitchEvent {
    location: string
    teamMemberId: number
    switchType: SwitchType
}

export interface EventLog {
    encounters: EncounterEvent[]
    deaths: DeathEvent[]
    evolutions: EvolutionEvent[]
    teamMemberSwitches: TeamMemberSwitchEvent[]
    notes: NoteEvent[]
    milestones: MilestoneEvent[]
}