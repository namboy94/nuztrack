import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import * as React from "react";

export default function AddEvent() {
    return (
        <Grid container spacing={2} id="runs">
            <Grid item xs={4}><Button variant="contained">Encounter</Button></Grid>
            <Grid item xs={4}><Button variant="contained">Death</Button></Grid>
            <Grid item xs={4}><Button variant="contained">Evolution</Button></Grid>
            <Grid item xs={4}><Button variant="contained">Milestone</Button></Grid>
            <Grid item xs={4}><Button variant="contained">Note</Button></Grid>
        </Grid>
    )
}