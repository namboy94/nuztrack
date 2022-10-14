import {Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import React from "react";
import {LocationInput} from "./common/LocationInput";
import {CancelButton, SubmitButton} from "../../common/inputs/Button";
import {NoteEventDialogViewModel} from "../hooks/vm/NoteEventDialog.hooks";

export function NoteEventDialog(props: NoteEventDialogViewModel) {
    const {state, interactions} = props

    return (
        <Dialog open={state.open} onClose={interactions.closeDialog}>
            <DialogTitle>Add Note</DialogTitle>
            <LocationInput location={state.location} setLocation={interactions.onChangeLocation}
                           locations={state.locations}/>
            <TextField
                data-testid="note-text-input"
                multiline
                label="Note"
                value={state.note}
                onChange={x => interactions.onChangeNote(x.target.value)}/>
            <DialogActions>
                <CancelButton onClick={interactions.closeDialog}/>
                <SubmitButton onClick={interactions.submit}/>
            </DialogActions>
        </Dialog>
    )
}