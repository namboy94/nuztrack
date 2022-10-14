import {CancelButton, SubmitButton} from "../../../common/inputs/Button";
import {DialogActions} from "@mui/material";
import React from "react";

export interface SubmitCancelDialogActionsProps {
    closeDialog: () => void,
    submit: () => void
}

export function SubmitCancelDialogActions(props: SubmitCancelDialogActionsProps) {
    return (<DialogActions>
        <CancelButton onClick={props.closeDialog}/>
        <SubmitButton onClick={props.submit}/>
    </DialogActions>)
}