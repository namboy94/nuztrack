import {NuzlockeRun, NuzlockeRunCreator, RunStatus} from "./runs.model";
import {NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";

class RunsConverter {
    convertNuzlockeRunModelToTO(model: NuzlockeRun): NuzlockeRunTO {
        return {...model, status: model.status.valueOf()}
    }

    convertNuzlockeRunTOToModel(to: NuzlockeRunTO): NuzlockeRun {
        return {...to, status: RunStatus[to.status as keyof typeof RunStatus]}
    }

    convertNuzlockeRunCreatorModelToTO(model: NuzlockeRunCreator): NuzlockeRunCreatorTO {
        return {...model}
    }

    convertNuzlockeRunCreatorTOToModel(to: NuzlockeRunCreatorTO): NuzlockeRunCreator {
        return {...to}
    }
}

export const runsConverter = new RunsConverter()