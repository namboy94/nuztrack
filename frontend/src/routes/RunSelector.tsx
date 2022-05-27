import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import CreateNewRunDialog from "./dialogs/CreateNewRunDialog";


export function RunSelector() {

    const [runs, setRuns] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const navigate = useNavigate()

    const loadData = () => {
        axios.get("/api/runs").then(
            result => {
                setRuns(result.data)
            },
            error => console.log(error)
        )
    }

    const selectRun = (id: string) => {
        localStorage.setItem("runId", id)
        navigate("/run")
    }

    const createRun = () => {
        selectRun("new")
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>Create</Button>
            <Grid container spacing={2} id="runs">
                {runs.map(({name, game}) =>
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
