export interface GameTO {
    title: string,
    key: string
    generation: number
}

export interface GameLocationTO {
    name: string,
    game: GameTO,
    encounters: number[],
    milestones: MilestoneTO[]
}

export interface MilestoneTO {
    name: string,
    image: string,
    level_cap: number,
    location: string
}
