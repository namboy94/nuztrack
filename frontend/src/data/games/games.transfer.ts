export interface GameListTO {
    [key: string]: string
}

export interface GameLocationTO {
    name: string,
    gameKey: string,
    encounters: number[],
    milestones: MilestoneTO[]
}

export interface MilestoneTO {
    name: string,
    image: string,
    level_cap: number,
    location: string
}
