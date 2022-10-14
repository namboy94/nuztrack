import {Dialog, DialogTitle, TextField} from "@mui/material";
import React from "react";
import {LocationInput} from "./common/LocationInput";
import {NoteEventDialogViewModel} from "../hooks/vm/NoteEventDialog.hooks";
import {SubmitCancelDialogActions} from "./common/SubmitCancelDialogActions";

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
            <SubmitCancelDialogActions closeDialog={interactions.closeDialog} submit={interactions.submit}/>
        </Dialog>
    )
}