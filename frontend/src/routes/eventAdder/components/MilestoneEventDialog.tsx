import {Dialog, DialogTitle} from "@mui/material";
import React from "react";
import {MilestoneEventDialogViewModel} from "../hooks/vm/MilestoneEventDialog.hooks";
import {SubmitCancelDialogActions} from "./common/SubmitCancelDialogActions";
import {MilestoneInput} from "./common/MilestoneInput";

export function MilestoneEventDialog(props: MilestoneEventDialogViewModel) {

    const {state, interactions} = props

    return (
        <Dialog open={state.open} onClose={interactions.closeDialog}>
            <DialogTitle>Add Milestone</DialogTitle>
            <MilestoneInput milestone={state.milestone}
                            milestones={state.milestones}
                            onChangeMilestone={interactions.onChangeMilestone}/>
            <SubmitCancelDialogActions closeDialog={interactions.closeDialog} submit={interactions.submit}/>
        </Dialog>
    )
}