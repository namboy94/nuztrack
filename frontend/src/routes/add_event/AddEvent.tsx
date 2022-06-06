import {Button, Grid} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import AddBadgeDialog from "./AddBadgeDialog";
import AddDeathDialog from "./AddDeathDialog";
import AddNoteDialog from "./AddNoteDialog";
import AddEncounterDialog from "./AddEncounterDialog";
import {useNaturesQuery, usePokedexQuery} from "../../api/pokedex/pokedexQuery";
import {useLocationsQuery} from "../../api/games/gamesQuery";
import {performLoadingCheck} from "../../util/loading";
import {Severity} from "../../components/Snackbar";
import {useTeamQuery} from "../../api/team_member/teamMemberQuery";

interface AddEventProps {
    run: NuzlockeRun,
    displaySnack: (message: string, severity: Severity) => void
}

export default function AddEvent(props: AddEventProps) {

    const [badgeDialogOpen, setBadgeDialogOpen] = useState(false)
    const [deathDialogOpen, setDeathDialogOpen] = useState(false)
    const [encounterDialogOpen, setEncounterDialogOpen] = useState(false)
    const [noteDialogOpen, setNoteDialogOpen] = useState(false)
    const pokedexQuery = usePokedexQuery()
    const locationsQuery = useLocationsQuery(props.run.game)
    const naturesQuery = useNaturesQuery()
    const teamQuery = useTeamQuery(props.run.id)
    const loadCheck = performLoadingCheck([pokedexQuery, locationsQuery, naturesQuery, teamQuery])
    if (loadCheck !== null) {
        return loadCheck
    }
    const pokedex = pokedexQuery.data!!
    const natures = naturesQuery.data!!
    const locations = locationsQuery.data!!
    const team = teamQuery.data!!

    return (
        <Grid direction="column" alignItems="center" container spacing={2} id="runs">
            <Grid item xs={3}><Button variant="contained"
                                      onClick={() => setEncounterDialogOpen(true)}>Encounter</Button></Grid>
            <Grid item xs={3}><Button variant="contained" onClick={() => setDeathDialogOpen(true)}>Death</Button></Grid>
            <Grid item xs={3}><Button variant="contained" onClick={() => setBadgeDialogOpen(true)}>Badge</Button></Grid>
            <Grid item xs={3}><Button variant="contained" onClick={() => setNoteDialogOpen(true)}>Note</Button></Grid>
            <AddBadgeDialog
                locations={locations}
                run={props.run} displaySnack={props.displaySnack}
                open={badgeDialogOpen} onClose={() => setBadgeDialogOpen(false)}
            />
            <AddDeathDialog
                locations={locations} team={team}
                run={props.run} displaySnack={props.displaySnack}
                open={deathDialogOpen} onClose={() => setDeathDialogOpen(false)}
            />
            <AddEncounterDialog
                pokedex={pokedex} locations={locations} natures={natures}
                run={props.run} displaySnack={props.displaySnack}
                open={encounterDialogOpen} onClose={() => setEncounterDialogOpen(false)}
            />
            <AddNoteDialog
                locations={locations}
                run={props.run} displaySnack={props.displaySnack}
                open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)}
            />
        </Grid>
    )
}
