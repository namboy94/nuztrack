import {NuzlockeRun} from "../../../data/runs/runs.model";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import * as React from "react";

export interface RunsTableProps {
    runs: NuzlockeRun[],
    openDeleteDialog: (run: NuzlockeRun) => void
}

export function RunsTable(props: RunsTableProps) {

    return (
        <Grid container spacing={2} id="runs">
            {props.runs.map((run) =>
                <Grid item xs={4} key={run.id}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {run.name} ({run.game})
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={() => console.log("SELECT")}>Select</Button>
                            <Button variant="contained" onClick={() => props.openDeleteDialog(run)}>Delete</Button>
                        </CardActions>
                    </Card>
                </Grid>
            )}
        </Grid>
    )
}