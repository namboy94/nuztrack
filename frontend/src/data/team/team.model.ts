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
    gender: Gender
    nature: string
    abilitySlot: number
    encounterId: number
    deathId: number | null
    evolutionIds: number[]
    teamSwitchIds: number[]
}