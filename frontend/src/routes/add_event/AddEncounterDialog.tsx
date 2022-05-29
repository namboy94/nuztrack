import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";

interface AddEncounterDialogProps {
    open: boolean
    onClose: () => void
}

export default function AddEncounterDialog(props: AddEncounterDialogProps) {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Encounter</DialogTitle>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}