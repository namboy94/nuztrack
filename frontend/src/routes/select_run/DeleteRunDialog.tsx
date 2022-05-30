import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";
import {deleteRun} from "../../api/runs/runsApi";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {Severity} from "../../components/Snackbar";

export interface DeleteRunDialogProps {
    open: boolean;
    onClose: () => void;
    runToDelete: NuzlockeRun | null;
    removeRun: (run: NuzlockeRun) => void;
    displaySnack: (message: string, severity: Severity) => void;
}

export default function DeleteRunDialog(props: DeleteRunDialogProps) {

    const removeSelectedRun = () => {
        if (props.runToDelete !== null) {
            deleteRun(props.runToDelete.id).then(() => {
                props.displaySnack(`Run ${props.runToDelete!!.name} was deleted`, "info")
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