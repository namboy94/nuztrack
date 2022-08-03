import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import React from "react";

export interface MultiCheckboxInputProps {
    toggleOption: (checked: boolean, key: string) => void
    options: Map<string, string>
    selected: string[]
    label: string
}

export function MultiCheckboxInput(props: MultiCheckboxInputProps) {
    return <>
        <h3>{props.label}</h3>
        <FormGroup>
            {Array.from(props.options.keys()).map(key =>
                <FormControlLabel label={props.options.get(key)} key={key} control={
                    <Checkbox
                        data-testid="multi-checkbox-input"
                        name={key}
                        checked={props.selected.includes(key)}
                        onChange={x => props.toggleOption(x.target.checked, key)}
                    />}/>
            )}
        </FormGroup>
    </>
}