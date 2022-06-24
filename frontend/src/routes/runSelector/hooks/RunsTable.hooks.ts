import {RunsTableProps} from "../components/RunsTable";
import {runsService} from "../../../data/runs/runs.service";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useQuery} from "../../../util/observable.hooks";
import {useNavigate} from "react-router";
import {NotificationFN} from "../../../global/Snackbar";
import {useCloseRun} from "../../common/hooks/closeRun.hook";

export function useRunsTableProps(
    notify: NotificationFN,
    openDeleteDialog: (run: NuzlockeRun) => void,
): RunsTableProps {
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
        runs: runs,
        openDeleteDialog: openDeleteDialog,
        activeRun: activeRun,
        selectActiveRun: selectActiveRun,
        closeRun: closeRun
    }

}