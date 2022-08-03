import {runsService} from "../../../data/runs/runs.service";
import {rulesService} from "../../../data/rules/rules.service";
import {gamesService} from "../../../data/games/games.service";
import {useService} from "../../../util/hooks/observable";

export function useRunSelectorDataLoader(): boolean {
    const loadingRuns = useService(() => runsService.loadRuns$(), [])
    const loadingRules = useService(() => rulesService.loadRulesDetails$(), [])
    const loadingGames = useService(() => gamesService.loadGames$(), [])
    return loadingRules || loadingRuns || loadingGames
}
