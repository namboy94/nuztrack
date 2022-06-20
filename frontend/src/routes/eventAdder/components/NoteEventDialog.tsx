import {Button, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import React from "react";
import {LocationInput} from "./common/LocationInput";

export interface NoteEventDialogProps {
    open: boolean
    onClose: () => void
    state: NoteEventDialogState
    locations: string[]
    submit: () => void
}

export interface NoteEventDialogState {
    text: string
    setText: (text: string) => void
    location: string
    setLocation: (location: string) => void
    reset: () => void
}

export function NoteEventDialog(props: NoteEventDialogProps) {
    const {open, onClose, locations, state, submit} = props

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Note</DialogTitle>
            <LocationInput location={state.location} setLocation={state.setLocation} locations={locations}/>
            <TextField
                data-testid="note-text-input"
                multiline
                label="Note"
                value={state.text}
                onChange={x => state.setText(x.target.value)}/>
            <DialogActions>
                <Button data-testid="cancel-button" onClick={onClose}>Cancel</Button>
                <Button data-testid="submit-button" onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}