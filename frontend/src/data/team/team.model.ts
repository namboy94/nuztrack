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

export class Team {
    private readonly data: TeamMember[]
    private idMap: Map<number, TeamMember>

    constructor(data: TeamMember[]) {
        this.data = data
        this.idMap = new Map<number, TeamMember>(data.map(member => [member.id, member]))
    }

    getTeamMembers(): TeamMember[] {
        return this.data
    }

    getTeamMemberById(id: number): TeamMember | null {
        return this.idMap.get(id) ?? null
    }
}