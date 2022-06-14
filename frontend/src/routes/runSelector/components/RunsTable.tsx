import {NuzlockeRun} from "../../../data/runs/runs.model";
import {Grid} from "@mui/material";
import * as React from "react";
import {RunsTableEntry} from "./RunsTableEntry";

export interface RunsTableProps {
    openDeleteDialog: (run: NuzlockeRun) => void
    runs: NuzlockeRun[]
    activeRun: NuzlockeRun | undefined
    selectActiveRun: (run: NuzlockeRun) => void
    closeRun: (run: NuzlockeRun) => void
}


export function RunsTable(props: RunsTableProps) {

    const {runs, openDeleteDialog, activeRun, selectActiveRun, closeRun} = props

    return (
        <Grid container spacing={2} id="runs">
            {runs.map((run) =>
                <Grid item xs={4} key={run.id}>
                    <RunsTableEntry
                        run={run}
                        active={run.id === activeRun?.id}
                        closeRun={closeRun}
                        openDeleteDialog={openDeleteDialog}
                        selectActiveRun={selectActiveRun}/>
                </Grid>
            )}
        </Grid>
    )
}