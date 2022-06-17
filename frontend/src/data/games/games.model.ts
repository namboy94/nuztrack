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
