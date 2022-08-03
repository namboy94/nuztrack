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
    private milestoneNameMapping: Map<string, Milestone>

    constructor(data: GameLocation[]) {
        this.data = data
        this.nameMapping = new Map<string, GameLocation>(this.data.map(location => [location.name, location]))
        this.milestoneNameMapping = new Map<string, Milestone>(
            this.getMilestones().map(milestone => [milestone.name, milestone])
        )
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

    getMilestoneByName(milestoneName: string): Milestone | null {
        return this.milestoneNameMapping.get(milestoneName) ?? null
    }
}

export const DEFAULT_GAME: Game = {
    generation: 3,
    key: "FIRERED",
    title: "FireRed"
}
