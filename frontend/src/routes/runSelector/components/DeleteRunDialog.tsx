import {NuzlockeRun} from "../../../data/runs/runs.model";
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";

export interface DeleteRunDialogProps {
    open: boolean
    onClose: () => void
    run: NuzlockeRun | null
    deleteRun: () => void
}

export function DeleteRunDialog(props: DeleteRunDialogProps) {
    const {open, run, onClose, deleteRun} = props

    if (run === null) {
        return <></>
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Run '{run.name}'?</DialogTitle>
            <DialogActions>
                <Button variant="contained"
                        color="info"
                        onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained"
                        color="error"
                        onClick={deleteRun}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}