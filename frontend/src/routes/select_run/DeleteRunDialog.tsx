import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {deleteRun} from "../../api/runs/runsApi";
import {useMutation} from "react-query";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";

export interface DeleteRunDialogProps {
    open: boolean;
    onClose: () => void;
    runToDelete: NuzlockeRunTO | null;
    setDisplayedRuns: Dispatch<SetStateAction<NuzlockeRunTO[]>>;
}

export default function DeleteRunDialog(props: DeleteRunDialogProps) {
    const {open, onClose} = props
    const runDeleter = useMutation(deleteRun)

    const removeRun = () => {
        if (props.runToDelete !== null) {
            const id = props.runToDelete.id
            runDeleter.mutate(id)
            props.setDisplayedRuns(previous => previous.filter(x => x.id !== id))
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