import {CreateMultiRun, MultiRunOption, NuzlockeRun, NuzlockeRunCreator, RunStatus} from "./runs.model";
import {CreateMultiRunTO, MultiRunOptionTO, NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";
import {gamesConverter} from "../games/games.convert";

class RunsConverter {
    convertNuzlockeRunTOToModel(to: NuzlockeRunTO): NuzlockeRun {
        return {
            ...to,
            status: RunStatus[to.status as keyof typeof RunStatus],
            game: gamesConverter.convertGameTOToModel(to.game)
        }
    }

    convertNuzlockeRunCreatorModelToTO(model: NuzlockeRunCreator): NuzlockeRunCreatorTO {
        return {...model, game: model.game.key}
    }

    convertCreateMultiRunModelToTO(model: CreateMultiRun): CreateMultiRunTO {
        return {...model, game: model.game.key}
    }

    convertMultiRunOptionTOToModel(to: MultiRunOptionTO): MultiRunOption {
        return to
    }
}

export const runsConverter = new RunsConverter()