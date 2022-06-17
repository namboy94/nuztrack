export interface TeamTO {
    active: TeamMemberTO[]
    boxed: TeamMemberTO[]
    dead: TeamMemberTO[]
}

export interface TeamMemberTO {
    id: number
    nickname: string
    pokedexNumber: number
    level: number
    gender: string | null
    nature: string | null
    abilitySlot: number | null
    encounterId: number
    deathId: number | null
    evolutionIds: number[]
    teamSwitchIds: number[]
}