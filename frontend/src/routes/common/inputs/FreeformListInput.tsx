import {TextField} from "@mui/material";
import React from "react";

export interface FreeFormListInputProps {
    label: string
    onChange: (newList: string[]) => void
    currentList: string[]
}

export function FreeformListInput(props: FreeFormListInputProps) {
    return <TextField
        data-testid="freeform-list-input"
        onChange={(x) => props.onChange(x.target.value.split("\n"))}
        fullWidth
        value={props.currentList.join("\n")}
        margin="dense"
        variant="filled"
        multiline
        type="text"
        label={props.label}
    />
}