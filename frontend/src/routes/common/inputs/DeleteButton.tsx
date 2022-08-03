import {Button} from "@mui/material";
import React from "react";

export interface DeleteButtonProps {
    onClick: () => void
    title?: string
}

export function DeleteButton(props: DeleteButtonProps) {
    return <Button data-testid="delete-button"
                   variant="contained" color="info"
                   onClick={props.onClick}>{props.title ?? "Delete"}</Button>
}