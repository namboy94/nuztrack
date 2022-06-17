import {GameLocationTO, GameTO, MilestoneTO} from "./games.transfer";
import {Game, GameLocation, Milestone} from "./games.model";

class GamesConverter {
    convertGameTOToModel(to: GameTO): Game {
        return {...to}
    }

    convertGameLocationTOToModel(to: GameLocationTO): GameLocation {
        return {...to, milestones: to.milestones.map(x => this.convertMilestoneTOToModel(x))}
    }

    convertMilestoneTOToModel(to: MilestoneTO): Milestone {
        return {...to}
    }
}

export const gamesConverter = new GamesConverter()