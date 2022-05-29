import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";

interface AddNoteDialogProps {
    open: boolean
    onClose: () => void
}

export default function AddNoteDialog(props: AddNoteDialogProps) {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Note</DialogTitle>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}