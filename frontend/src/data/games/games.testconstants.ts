import {Game, GameLocation, GameLocationRegistry, Milestone} from "./games.model";
import {GameLocationTO, GameTO, MilestoneTO} from "./games.transfer";

export const GAME_1_TO: GameTO = {generation: 1, key: "RED", title: "Red"}
export const GAME_2_TO: GameTO = {generation: 3, key: "FIRERED", title: "FireRed"}
export const GAME_3_TO: GameTO = {generation: 6, key: "X", title: "X"}
export const GAME_4_TO: GameTO = {generation: 7, key: "ULTRA_SUN", title: "Ultra Sun"}

export const GAME_1: Game = {generation: 1, key: "RED", title: "Red"}
export const GAME_2: Game = {generation: 3, key: "FIRERED", title: "FireRed"}
export const GAME_3: Game = {generation: 6, key: "X", title: "X"}
export const GAME_4: Game = {generation: 7, key: "ULTRA_SUN", title: "Ultra Sun"}

export const GAMES_TO = [GAME_1_TO, GAME_2_TO, GAME_3_TO, GAME_4_TO]
export const GAMES = [GAME_1, GAME_2, GAME_3, GAME_4]
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
    game: GAME_1,
    encounters: [1, 4, 7],
    milestones: [],
    name: "Pallet Town"
}
export const GAME_LOCATION_PALLET_TO: GameLocationTO = {
    game: GAME_1_TO,
    encounters: [1, 4, 7],
    milestones: [],
    name: "Pallet Town"
}
export const GAME_LOCATION_VIRIDIAN: GameLocation = {
    game: GAME_2,
    encounters: [2],
    milestones: [MILESTONE],
    name: "Viridian City"
}
export const GAME_LOCATION_VIRIDIAN_TO: GameLocationTO = {
    game: GAME_2_TO,
    encounters: [2],
    milestones: [MILESTONE_TO],
    name: "Viridian City"
}
export const GAME_LOCATIONS_TO = [GAME_LOCATION_PALLET_TO, GAME_LOCATION_VIRIDIAN_TO]
export const GAME_LOCATIONS = [GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN]
export const LOCATION_REGISTRY = new GameLocationRegistry([GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN])
