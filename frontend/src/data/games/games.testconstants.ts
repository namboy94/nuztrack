import {GameList, GameLocation, Milestone} from "./games.model";
import {GameListTO, GameLocationTO, MilestoneTO} from "./games.transfer";

export const GAME_LIST: GameList = new Map<string, string>([
    ["RED", "Red"],
    ["BLUE", "Blue"],
    ["GREEN", "Green"],
    ["YELLOW", "Yellow"]
])
export const GAME_LIST_TO: GameListTO = {
    "RED": "Red",
    "BLUE": "Blue",
    "GREEN": "Green",
    "YELLOW": "Yellow"
}
export const MILESTONE: Milestone = {
    image: "URL",
    level_cap: 60,
    location: "Viridian City",
    name: "Earth Badge"
}
export const MILESTONE_TO: MilestoneTO = {
    image: "URL",
    level_cap: 60,
    location: "Viridian City",
    name: "Earth Badge"
}
export const GAME_LOCATION_PALLET: GameLocation = {
    gameKey: "RED",
    encounters: [1, 4, 7],
    milestones: [],
    name: "Pallet Town"
}
export const GAME_LOCATION_PALLET_TO: GameLocationTO = {
    gameKey: "RED",
    encounters: [1, 4, 7],
    milestones: [],
    name: "Pallet Town"
}
export const GAME_LOCATION_VIRIDIAN: GameLocation = {
    gameKey: "BLUE",
    encounters: [60],
    milestones: [MILESTONE],
    name: "Viridian City"
}
export const GAME_LOCATION_VIRIDIAN_TO: GameLocationTO = {
    gameKey: "BLUE",
    encounters: [60],
    milestones: [MILESTONE_TO],
    name: "Viridian City"
}