import {Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";
import {DeleteRunDialogViewModel} from "../hooks/vm/DeleteRunDialog.vm";
import {CancelButton, DeleteButton} from "../../common/inputs/Button";

export function DeleteRunDialog(props: DeleteRunDialogViewModel) {
    const {state, interactions} = props

    if (state.run === null) {
        return <>No run selected</>
    }

    return (
        <Dialog open={state.open} onClose={interactions.closeDialog}>
            <DialogTitle data-testid="title">Delete Run '{state.run.name}'?</DialogTitle>
            <DialogActions>
                <CancelButton onClick={interactions.closeDialog}/>
                <DeleteButton onClick={interactions.submit}/>
            </DialogActions>
        </Dialog>
    )
}