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
    gender: string
    nature: string
    abilitySlot: number
    encounterId: number
    deathId: number | null
    evolutionIds: number[]
    teamSwitchIds: number[]
}