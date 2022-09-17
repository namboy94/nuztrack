import {TextField} from "@mui/material";
import React from "react";

export interface LevelInputProps {
    level: number | null
    setLevel: (level: number | null) => void
}

export function LevelInput(props: LevelInputProps) {

    const setLevel = (value: number) => {
        const numberValue = !!value ? value : null
        if (numberValue === null || (numberValue >= 0 && numberValue <= 100)) {
            props.setLevel(numberValue)
        }
    }

    return (
        <TextField
            sx={{margin: 1, width: 80}}
            data-testid="level-input"
            label="Level"
            type="number"
            InputProps={{inputProps: {min: 1, max: 100}}}
            value={props.level || ""}
            onChange={value => setLevel(parseInt(value.target.value))}
        />
    )
}
