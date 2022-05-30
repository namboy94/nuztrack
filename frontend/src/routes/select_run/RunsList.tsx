import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import * as React from "react";
import {NuzlockeRun} from "../../api/runs/runsTypes";

interface RunsListProps {
    displayedRuns: NuzlockeRun[],
    selectRun: (run: NuzlockeRun) => void,
    openRemoveDialog: (run: NuzlockeRun) => void
}

export function RunsList(props: RunsListProps) {
    return (
        <Grid container spacing={2} id="runs">
            {props.displayedRuns.map((run) =>
                <Grid item xs={4} key={run.id}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {run.name} ({run.game})
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={() => props.selectRun(run)}>Select</Button>
                            <Button variant="contained" onClick={() => props.openRemoveDialog(run)}>Delete</Button>
                        </CardActions>
                    </Card>
                </Grid>
            )}
        </Grid>
    )
}