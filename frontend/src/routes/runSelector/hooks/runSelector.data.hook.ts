import {runsService} from "../../../data/runs/runs.service";
import {rulesService} from "../../../data/rules/rules.service";
import {gamesService} from "../../../data/games/games.service";
import {useService} from "../../../util/observable.hooks";

export function useRunSelectorDataLoader(): boolean {
    const loadingRuns = useService(runsService.loadRuns$(), [])
    const loadingRules = useService(rulesService.loadRulesDetails$(), [])
    const loadingGames = useService(gamesService.loadGameList$(), [])
    return loadingRules || loadingRuns || loadingGames
}
