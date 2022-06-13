import {RunsTableProps} from "../components/RunsTable";
import {runsService} from "../../../data/runs/runs.service";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useQuery} from "../../../util/observable.hooks";

export function useRunsTableProps(openDeleteDialog: (run: NuzlockeRun) => void): RunsTableProps {
    const runs = useQuery(runsService.getRuns$(), [], [])

    return {
        runs: runs,
        openDeleteDialog: openDeleteDialog
    }

}