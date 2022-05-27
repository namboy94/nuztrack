import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {useNavigate} from "react-router";
import CreateNewRunDialog from "./CreateNewRunDialog";
import {useQuery} from "react-query";
import {loadRuns} from "../../api/runs/runsApi";


export function RunSelector() {

    const navigate = useNavigate()
    const [dialogOpen, setDialogOpen] = useState(false)
    const runData = useQuery("runs", loadRuns)

    if (runData.isLoading || runData.isIdle) {
        return <h1>Loading...</h1>
    }
    if (runData.error || runData.data === undefined) {
        return <h1>Error</h1>
    }

    const selectRun = (id: string) => {
        localStorage.setItem("runId", id)
        navigate("/run")
    }

    console.log(runData.data)

    return (
        <>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>Create</Button>
            <Grid container spacing={2} id="runs">
                {runData.data.map(({name, game}) =>
                    <Grid item xs={4} key={name + game}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {name} ({game})
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" onClick={() => selectRun(name)}>
                                    Select
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>
            <CreateNewRunDialog open={dialogOpen} onClose={() => setDialogOpen(false)}/>
        </>
    )
}
