import {NuzlockeRun, NuzlockeRunCreator, RunStatus} from "./runs.model";
import {NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";
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
}

export const runsConverter = new RunsConverter()