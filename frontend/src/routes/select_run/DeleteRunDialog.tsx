import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";
import {deleteRun} from "../../api/runs/runsApi";
import {useMutation} from "react-query";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";

export interface DeleteRunDialogProps {
    open: boolean;
    onClose: () => void;
    runToDelete: NuzlockeRunTO | null;
    removeRun: (run: NuzlockeRunTO) => void;
}

export default function DeleteRunDialog(props: DeleteRunDialogProps) {
    const {open, onClose} = props
    const runDeleter = useMutation(deleteRun)

    const removeRun = () => {
        if (props.runToDelete !== null) {
            runDeleter.mutate(props.runToDelete.id)
            props.removeRun(props.runToDelete)
        }
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Run?</DialogTitle>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={removeRun}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}