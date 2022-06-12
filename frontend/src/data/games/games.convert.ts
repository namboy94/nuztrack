import {GameListTO, GameLocationTO, MilestoneTO} from "./games.transfer";
import {GameList, GameLocation, Milestone} from "./games.model";

class GamesConverter {
    convertGameListTOToModel(to: GameListTO): GameList {
        return new Map<string, string>(Object.entries(to))
    }

    convertGameLocationTOToModel(to: GameLocationTO): GameLocation {
        return {...to, milestones: to.milestones.map(x => this.convertMilestoneTOToModel(x))}
    }

    convertMilestoneTOToModel(to: MilestoneTO): Milestone {
        return {...to}
    }
}

export const gamesConverter = new GamesConverter()