import {NuzlockeRun} from "../../../data/runs/runs.model";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import * as React from "react";

export interface RunsTableProps {
    openDeleteDialog: (run: NuzlockeRun) => void,
    runs: NuzlockeRun[]
}

export function RunsTable(props: RunsTableProps) {

    const {runs, openDeleteDialog} = props

    return (
        <Grid container spacing={2} id="runs">
            {runs.map((run) =>
                <Grid item xs={4} key={run.id}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {run.name} ({run.game})
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={() => console.log("TODO SELECT")}>Select</Button>
                            <Button variant="contained" onClick={() => openDeleteDialog(run)}>Delete</Button>
                        </CardActions>
                    </Card>
                </Grid>
            )}
        </Grid>
    )
}