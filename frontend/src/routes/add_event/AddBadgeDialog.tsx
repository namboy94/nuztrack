import {Button, Dialog, DialogActions, DialogTitle, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";

interface AddBadgeDialogProps {
    open: boolean
    onClose: () => void
}

export default function AddBadgeDialog(props: AddBadgeDialogProps) {

    const badges = ["One", "Two", "Three"]
    const [badge, setBadge] = useState("")

    const submit = () => {
    }

    const onClose = () => {
        setBadge("")
        props.onClose()
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Badge</DialogTitle>
            <Select fullWidth value={badge} onChange={x => setBadge(x.target.value)}>
                {badges.map((x: string) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
            </Select>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}