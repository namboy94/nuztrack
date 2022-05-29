import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";

interface AddDeathDialogProps {
    open: boolean
    onClose: () => void
}

export default function AddDeathDialog(props: AddDeathDialogProps) {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Death</DialogTitle>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}