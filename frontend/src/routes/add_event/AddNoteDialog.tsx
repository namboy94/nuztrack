import {Button, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";

interface AddNoteDialogProps {
    open: boolean
    onClose: () => void
}

export default function AddNoteDialog(props: AddNoteDialogProps) {

    const [note, setNote] = useState("")

    const submit = () => {
    }

    const onClose = () => {
        setNote("")
        props.onClose()
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Note</DialogTitle>
            <TextField multiline label="Note" value={note} onChange={x => setNote(x.target.value)}/>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}