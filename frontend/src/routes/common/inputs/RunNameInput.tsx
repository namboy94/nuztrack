import {TextField} from "@mui/material";
import React from "react";

export interface RunNameProps {
    onChange: (newName: string) => void
    name: string
}

export function RunNameInput(props: RunNameProps) {
    return <TextField
        data-testid="name-input"
        autoFocus
        margin="dense"
        variant="outlined"
        type="text"
        required
        label="Run Name"
        value={props.name}
        onChange={x => props.onChange(x.target.value)}
    />
}