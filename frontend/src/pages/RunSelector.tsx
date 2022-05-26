import {Button, Grid} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";


export function RunSelector() {

    const [runs, setRuns] = useState([])
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

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Grid container spacing={2} id="runs">
            <Grid item xs={4}>
                <Button variant="contained" onClick={() => console.log("Create")}>
                    +
                </Button>
            </Grid>

            {runs.map(({name, game}) =>
                <Grid item xs={4} key={name + game}>
                    <Button variant="contained" onClick={() => selectRun(name)}>
                        {name} ({game})
                    </Button>
                </Grid>
            )}
        </Grid>
    )
}
