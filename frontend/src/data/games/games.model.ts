import {GameLocationTO, MilestoneTO} from "./games.transfer";

export type GameList = Map<string, string>

export interface GameLocation extends GameLocationTO {
}

export interface Milestone extends MilestoneTO {
}
