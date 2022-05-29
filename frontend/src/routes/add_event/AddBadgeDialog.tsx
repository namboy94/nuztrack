import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";

interface AddBadgeDialogProps {
    open: boolean
    onClose: () => void
}

export default function AddBadgeDialog(props: AddBadgeDialogProps) {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Badge</DialogTitle>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}