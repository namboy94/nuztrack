import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";
import {deleteRun} from "../../api/runs/runsApi";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";

export interface DeleteRunDialogProps {
    open: boolean;
    onClose: () => void;
    runToDelete: NuzlockeRunTO | null;
    removeRun: (run: NuzlockeRunTO) => void;
}

export default function DeleteRunDialog(props: DeleteRunDialogProps) {

    const removeSelectedRun = () => {
        if (props.runToDelete !== null) {
            deleteRun(props.runToDelete.id).then(() => {
                props.removeRun(props.runToDelete!!)
                props.onClose()
            })
        } else {
            props.onClose()
        }
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Delete Run?</DialogTitle>
            <DialogActions>
                <Button data-testid="cancel-button" onClick={props.onClose}>Cancel</Button>
                <Button data-testid="delete-button" onClick={removeSelectedRun}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}