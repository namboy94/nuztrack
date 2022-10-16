export interface EventTO {
    id: number
    runId: number
    timestamp: string
    location: string
}

export interface EncounterEventTO {
    event: EventTO
    pokedexNumber: number
    level: number
    caught: boolean
    teamMemberId: number | null
    sprite: string
}

export interface CreateEncounterEventTO {
    location: string
    pokedexNumber: number
    level: number
    caught: boolean
    pokemon: CreateEncounterPokemonTO | null
}

export interface CreateEncounterPokemonTO {
    nickname: string
    gender: string | null
    nature: string | null
    abilitySlot: number | null
}

export interface DeathEventTO {
    event: EventTO
    teamMemberId: number
    level: number
    opponent: string
    description: string
}

export interface CreateDeathEventTO {
    location: string
    teamMemberId: number
    level: number
    opponent: string
    description: string
}

export interface EvolutionEventTO {
    event: EventTO
    teamMemberId: number
    level: number
    previousPokedexNumber: number
    newPokedexNumber: number
}

export interface CreateEvolutionEventTO {
    location: string
    teamMemberId: number
    level: number
    newPokedexNumber: number
}

export interface NoteEventTO {
    event: EventTO
    text: string
}

export interface CreateNoteEventTO {
    location: string
    text: string
}

export interface MilestoneEventTO {
    event: EventTO
    milestone: string
}

export interface CreateMilestoneEventTO {
    location: string
    milestone: string
}

export interface TeamMemberSwitchEventTO {
    event: EventTO
    teamMemberId: number
    switchType: string
}

export interface CreateTeamMemberSwitchEventTO {
    location: string
    teamMemberId: number
    switchType: string
}

export interface EventLogTO {
    encounters: EncounterEventTO[]
    deaths: DeathEventTO[]
    evolutions: EvolutionEventTO[]
    teamMemberSwitches: TeamMemberSwitchEventTO[]
    notes: NoteEventTO[]
    milestones: MilestoneEventTO[]
}