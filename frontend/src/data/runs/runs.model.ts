import {NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";

export interface NuzlockeRun extends Omit<NuzlockeRunTO, "status"> {
    status: RunStatus
}

export interface NuzlockeRunCreator extends NuzlockeRunCreatorTO {
}

export enum RunStatus {
    ACTIVE = "ACTIVE",
    FAILED = "FAILED",
    COMPLETED = "COMPLETED"
}
