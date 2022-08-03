import {Button} from "@mui/material";
import React from "react";

export interface SubmitButtonProps {
    onClick: () => void
    title?: string
}

export function SubmitButton(props: SubmitButtonProps) {
    return <Button data-testid="submit-button"
                   variant="contained" color="success"
                   onClick={props.onClick}>{props.title ?? "Submit"}</Button>
}