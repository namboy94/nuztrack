import {Button} from "@mui/material";
import React from "react";

export interface CancelButtonProps {
    onClick: () => void
    title?: string
}

export function CancelButton(props: CancelButtonProps) {
    return <Button data-testid="cancel-button"
                   variant="contained" color="info"
                   onClick={props.onClick}>{props.title ?? "Cancel"}</Button>
}