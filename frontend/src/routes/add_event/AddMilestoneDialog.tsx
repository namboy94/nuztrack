import {Button, Dialog, DialogActions, DialogTitle, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {GameLocation, Milestone} from "../../api/games/gamesTypes";
import {CreateMilestoneEvent} from "../../api/events/milestone/milestoneEventTypes";
import {createMilestoneEvent} from "../../api/events/milestone/milestoneEventApi";

interface AddMilestoneDialogProps {
    open: boolean
    onClose: () => void
    displaySnack: (message: string, severity: Severity) => void
    run: NuzlockeRun
    locations: GameLocation[]
}

export default function AddMilestoneDialog(props: AddMilestoneDialogProps) {

    const milestones: Milestone[] = []
    props.locations.forEach(x => x.milestones.forEach(y => milestones.push(y)))
    const milestoneLocations = new Map<string, string>()
    milestones.forEach(x => milestoneLocations.set(x.name, x.location))

    const [milestone, setMilestone] = useState("")

    const submit = () => {
        const payload: CreateMilestoneEvent = {
            location: milestoneLocations.get(milestone)!!,
            milestone: milestone
        }
        createMilestoneEvent(props.run.id, payload).then(
            success => {
                props.displaySnack("Milestone created successfully", "info")
                onClose()
            },
            error => {
                props.displaySnack(error.toString(), "error")
            }
        )
        console.log(payload)
    }

    const onClose = () => {
        setMilestone("")
        props.onClose()
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Badge</DialogTitle>
            <Select fullWidth value={milestone} onChange={x => setMilestone(x.target.value)}>
                {milestones.map(x => <MenuItem value={x.name} key={x.name}>{x.name}</MenuItem>)}
            </Select>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}