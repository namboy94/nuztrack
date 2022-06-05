export type Team = {
    active: TeamMember[],
    boxed: TeamMember[],
    dead: TeamMember[]
}
export type TeamMember = {
    id: number,
    nickname: string,
    pokedexNumber: number,
    level: number,
    nature: string,
    abilitySlot: number,
    encounterId: number,
    deathId: number | null,
    evolutionIds: string[],
    teamSwitchIds: string[]
}