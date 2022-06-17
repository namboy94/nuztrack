import {NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";
import {Game} from "../games/games.model";

export interface NuzlockeRun extends Omit<NuzlockeRunTO, "status" | "game"> {
    status: RunStatus
    game: Game
}

export interface NuzlockeRunCreator extends Omit<NuzlockeRunCreatorTO, "game"> {
    game: Game
}

export enum RunStatus {
    ACTIVE = "ACTIVE",
    FAILED = "FAILED",
    COMPLETED = "COMPLETED"
}
