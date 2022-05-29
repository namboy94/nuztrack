import {Button, Grid} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";
import AddBadgeDialog from "./AddBadgeDialog";
import AddDeathDialog from "./AddDeathDialog";
import AddNoteDialog from "./AddNoteDialog";
import AddEncounterDialog from "./AddEncounterDialog";

interface AddEventProps {
    run: NuzlockeRunTO
}

export default function AddEvent(props: AddEventProps) {

    const [badgeDialogOpen, setBadgeDialogOpen] = useState(false)
    const [deathDialogOpen, setDeathDialogOpen] = useState(false)
    const [encounterDialogOpen, setEncounterDialogOpen] = useState(false)
    const [noteDialogOpen, setNoteDialogOpen] = useState(false)

    return (
        <Grid direction="column" alignItems="center" container spacing={2} id="runs">
            <Grid item xs={3}><Button variant="contained"
                                      onClick={() => setEncounterDialogOpen(true)}>Encounter</Button></Grid>
            <Grid item xs={3}><Button variant="contained" onClick={() => setDeathDialogOpen(true)}>Death</Button></Grid>
            <Grid item xs={3}><Button variant="contained" onClick={() => setBadgeDialogOpen(true)}>Badge</Button></Grid>
            <Grid item xs={3}><Button variant="contained" onClick={() => setNoteDialogOpen(true)}>Note</Button></Grid>
            <AddBadgeDialog open={badgeDialogOpen} onClose={() => setBadgeDialogOpen(false)}/>
            <AddDeathDialog open={deathDialogOpen} onClose={() => setDeathDialogOpen(false)}/>
            <AddEncounterDialog open={encounterDialogOpen} onClose={() => setEncounterDialogOpen(false)}/>
            <AddNoteDialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)}/>
        </Grid>
    )
}
