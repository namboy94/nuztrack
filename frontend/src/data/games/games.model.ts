import {GameLocationTO, MilestoneTO} from "./games.transfer";

export interface Game {
    title: string,
    key: string
    generation: number
}

export interface GameLocation extends GameLocationTO {
    game: Game
}

export interface Milestone extends MilestoneTO {
}

export class GameLocationRegistry {
    private data: GameLocation[]
    private nameMapping: Map<string, GameLocation>

    constructor(data: GameLocation[]) {
        this.data = data
        this.nameMapping = new Map<string, GameLocation>(this.data.map(location => [location.name, location]))
    }

    getLocationByName(locationName: string): GameLocation | null {
        return this.nameMapping.get(locationName) ?? null
    }

    getLocationNames(): string[] {
        return this.data.map(x => x.name)
    }

    getMilestones(): Milestone[] {
        return this.data.filter(x => x.milestones.length > 0).map(x => x.milestones).flat()
    }
}