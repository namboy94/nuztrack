import {Autocomplete, Button, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {GameLocation} from "../../api/games/gamesTypes";
import {createNoteEvent} from "../../api/events/note/noteEventApi";
import {CreateNoteEvent} from "../../api/events/note/noteEventTypes";

interface AddNoteDialogProps {
    open: boolean
    onClose: () => void
    displaySnack: (message: string, severity: Severity) => void
    run: NuzlockeRun
    locations: GameLocation[]
}

export default function AddNoteDialog(props: AddNoteDialogProps) {


    const [location, setLocation] = useState("")
    const [note, setNote] = useState("")

    const submit = () => {
        const payload: CreateNoteEvent = {
            "location": location,
            "text": note
        }
        createNoteEvent(props.run.id, payload).then(
            success => {
                props.displaySnack("Note created successfully", "info")
                onClose()
            },
            error => {
                props.displaySnack(error.toString(), "error")
            }
        )
        console.log(payload)
    }

    const onClose = () => {
        setNote("")
        setLocation("")
        props.onClose()
    }

    const selectLocation = (text: string | null) => {
        if (text !== null) {
            setLocation(text)
        }
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Note</DialogTitle>
            <Autocomplete
                freeSolo
                options={props.locations.map(x => x.name)}
                onChange={(_, newLocation) => selectLocation(newLocation)}
                renderInput={(params) => <TextField
                    {...params} label="Location" value={location}
                    onChange={x => selectLocation(x.target.value)}
                />}
            />
            <TextField multiline label="Note" value={note} onChange={x => setNote(x.target.value)}/>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}