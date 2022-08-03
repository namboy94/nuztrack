import {Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";
import {DeleteRunDialogViewModel} from "../hooks/DeleteRunDialog.hooks";
import {CancelButton} from "../../common/inputs/CancelButton";
import {DeleteButton} from "../../common/inputs/DeleteButton";

export function DeleteRunDialog(props: DeleteRunDialogViewModel) {
    const {state, interactions} = props

    if (state.run === undefined) {
        return <></>
    }

    return (
        <Dialog open={state.open} onClose={interactions.onClose}>
            <DialogTitle data-testid="title">Delete Run '{state.run.name}'?</DialogTitle>
            <DialogActions>
                <CancelButton onClick={interactions.onClose}/>
                <DeleteButton onClick={interactions.submit}/>
            </DialogActions>
        </Dialog>
    )
}