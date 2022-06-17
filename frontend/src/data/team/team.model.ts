export enum Gender {
    MALE,
    FEMALE,
    NEUTRAL
}

export enum TeamState {
    ACTIVE,
    BOXED,
    DEAD
}

export interface TeamMember {
    id: number
    runId: number
    teamState: TeamState
    nickname: string
    pokedexNumber: number
    level: number
    gender: Gender | null
    nature: string | null
    abilitySlot: number | null
    encounterId: number
    deathId: number | null
    evolutionIds: number[]
    teamSwitchIds: number[]
}