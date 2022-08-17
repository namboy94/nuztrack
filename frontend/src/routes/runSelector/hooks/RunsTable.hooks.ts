import {runsService} from "../../../data/runs/runs.service";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useQuery} from "../../../util/hooks/observable";
import {useNavigate} from "react-router";
import {NotificationFN} from "../../../global/Snackbar";
import {useCloseRun} from "../../common/hooks/closeRun.hook";
import {ViewModel} from "../../../util/viewmodel";

export interface RunsTableState {
    runs: NuzlockeRun[]
    activeRun: NuzlockeRun | null
}

export interface RunsTableInteractions {
    openDeleteDialog: (run: NuzlockeRun) => void
    selectActiveRun: (run: NuzlockeRun) => void
    closeRun: (run: NuzlockeRun) => void
}

export type RunsTableViewModel = ViewModel<RunsTableState, RunsTableInteractions>

export function useRunsTableViewModel(
    notify: NotificationFN,
    openDeleteDialog: (run: NuzlockeRun) => void,
): RunsTableViewModel {
    const navigate = useNavigate()
    const runs = useQuery(() => runsService.getRuns$(), [], [])
    const activeRun = useQuery(() => runsService.getActiveRun$(), undefined, [])
    const closeRun = useCloseRun(notify)

    const selectActiveRun = (run: NuzlockeRun) => {
        runsService.selectActiveRun(run)
        navigate("/overview")
        notify(`Selected Run ${run.name}`, "info")
    }

    return {
        state: {
            activeRun: activeRun ?? null,
            runs: runs
        },
        interactions: {
            openDeleteDialog: openDeleteDialog,
            selectActiveRun: selectActiveRun,
            closeRun: closeRun
        }
    }
}
