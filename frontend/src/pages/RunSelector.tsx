import {Button, Card, Grid} from "@mui/material";
import * as React from "react";
import axios from "axios";
import {createAxios, keycloak} from "../util/keycloak";
import {get} from "../util/api";


const existing = [
    {name: "Run 1", game: "Red"},
    {name: "Run 2", game: "Blue"},
    {name: "Run 1", game: "Red"},
    {name: "Run 2", game: "Blue"},
    {name: "Run 1", game: "Red"},
    {name: "Run 2", game: "Blue"},
    {name: "Run 1", game: "Red"},
    {name: "Run 2", game: "Blue"},
    {name: "Run 1", game: "Red"},
    {name: "Run 2", game: "Blue"},
    {name: "Run 1", game: "Red"},
]


export class RunSelector extends React.Component {

    state = {
        error: null,
        isLoaded: false,
        runs: []
    }

    componentDidMount() {
        axios.get("/api/runs").then(
            result => {this.setState({isLoaded: true, runs: result.data})},
            error => this.setState({isLoaded: true, error: error})
        )
    }

    render() {
        const { error, isLoaded, runs } = this.state;

        if (error) {
            return <h1>Error</h1>
        }
        if (!isLoaded) {
            return <h1>Loading</h1>
        }
        return (
            <Grid container spacing={2} id="runs">
                {runs.map(({name, game}) =>
                    <Grid item xs={4}>
                        <Button variant="contained">
                            {name} ({game})
                        </Button>
                    </Grid>
                )}
            </Grid>
        )
    }
}
