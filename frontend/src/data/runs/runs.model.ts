import {CreateMultiRunTO, MultiRunOptionTO, NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";
import {Game} from "../games/games.model";

export interface NuzlockeRun extends Omit<NuzlockeRunTO, "status" | "game"> {
    status: RunStatus
    game: Game
}

export interface NuzlockeRunCreator extends Omit<NuzlockeRunCreatorTO, "game"> {
    game: Game
}

export interface CreateMultiRun extends Omit<CreateMultiRunTO, "game"> {
    game: Game
}

export interface MultiRunOption extends MultiRunOptionTO {
}

export enum RunStatus {
    ACTIVE = "ACTIVE",
    FAILED = "FAILED",
    COMPLETED = "COMPLETED"
}
