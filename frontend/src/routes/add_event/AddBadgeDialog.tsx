import {Button, Dialog, DialogActions, DialogTitle, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {GameLocation} from "../../api/games/gamesTypes";

interface AddBadgeDialogProps {
    open: boolean
    onClose: () => void
    displaySnack: (message: string, severity: Severity) => void
    run: NuzlockeRun
    locations: GameLocation[]
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