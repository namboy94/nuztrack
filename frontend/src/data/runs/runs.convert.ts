import {NuzlockeRun, NuzlockeRunCreator, RunStatus} from "./runs.model";
import {NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";

class RunsConverter {
    convertNuzlockeRunTOToModel(to: NuzlockeRunTO): NuzlockeRun {
        return {...to, status: RunStatus[to.status as keyof typeof RunStatus]}
    }

    convertNuzlockeRunCreatorModelToTO(model: NuzlockeRunCreator): NuzlockeRunCreatorTO {
        return {...model}
    }
}

export const runsConverter = new RunsConverter()