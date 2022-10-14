import {Autocomplete, Box, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import React from "react";
import {MilestoneEventDialogViewModel} from "../hooks/vm/MilestoneEventDialog.hooks";
import {CancelButton, SubmitButton} from "../../common/inputs/Button";

export function MilestoneEventDialog(props: MilestoneEventDialogViewModel) {

    const {state, interactions} = props

    return (
        <Dialog open={state.open} onClose={interactions.closeDialog}>
            <DialogTitle>Add Milestone</DialogTitle>
            <Autocomplete
                data-testid="milestone-input"
                value={state.milestone}
                options={state.milestones}
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
                onChange={(_, milestone) => interactions.onChangeMilestone(milestone)}
                renderInput={(params) => <TextField{...params} label="Milestone"/>}
            />
            <DialogActions>
                <CancelButton onClick={interactions.closeDialog}/>
                <SubmitButton onClick={interactions.submit}/>
            </DialogActions>
        </Dialog>
    )
}