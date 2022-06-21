import {Autocomplete, Box, Button, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import React from "react";
import {Milestone} from "../../../data/games/games.model";

export interface MilestoneEventDialogProps {
    open: boolean
    onClose: () => void
    milestones: Milestone[]
    state: MilestoneEventDialogState
    submit: () => void
}

export interface MilestoneEventDialogState {
    milestone: Milestone | null
    setMilestone: (milestone: Milestone | null) => void
    reset: () => void
}

export function MilestoneEventDialog(props: MilestoneEventDialogProps) {

    const {open, onClose, milestones, state, submit} = props

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Milestone</DialogTitle>
            <Autocomplete
                data-testid="milestone-input"
                value={state.milestone}
                options={milestones}
                renderOption={(p, option) => (
                    <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...p}>
                        <img
                            loading="lazy"
                            width="100"
                            src={option.image}
                            alt={option.name}
                        />
                        {option.name}
                    </Box>
                )}
                getOptionLabel={milestone => milestone.name}
                onChange={(_, milestone) => state.setMilestone(milestone)}
                renderInput={(params) => <TextField{...params} label="Milestone"/>}
            />
            <DialogActions>
                <Button data-testid="cancel-button" onClick={onClose}>Cancel</Button>
                <Button data-testid="submit-button" onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}