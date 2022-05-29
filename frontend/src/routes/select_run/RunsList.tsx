import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import * as React from "react";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";

interface RunsListProps {
    displayedRuns: NuzlockeRunTO[],
    selectRun: (run: NuzlockeRunTO) => void,
    openRemoveDialog: (run: NuzlockeRunTO) => void
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