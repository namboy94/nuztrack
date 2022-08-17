import {Grid} from "@mui/material";
import * as React from "react";
import {RunsTableEntry} from "./RunsTableEntry";
import {RunsTableViewModel} from "../hooks/RunsTable.vm";


export function RunsTable(props: RunsTableViewModel) {

    const {state, interactions} = props

    return (
        <Grid container spacing={2} id="runs">
            {state.runs.map((run) =>
                <Grid
                    data-testid="run-entry-grid"
                    item xs={4}
                    key={run.id}
                >
                    <RunsTableEntry
                        run={run}
                        active={run.id === state.activeRun?.id}
                        closeRun={interactions.closeRun}
                        openDeleteDialog={interactions.openDeleteDialog}
                        selectActiveRun={interactions.selectActiveRun}/>
                </Grid>
            )}
        </Grid>
    )
}