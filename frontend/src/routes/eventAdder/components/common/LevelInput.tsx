import {TextField} from "@mui/material";
import React from "react";

export interface LevelInputProps {
    level: number | null
    setLevel: (level: number | null) => void
}

export function LevelInput(props: LevelInputProps) {

    const {level, setLevel} = props

    const onChange = (newValue: string) => {
        const parsed = parseInt(newValue)
        setLevel(isNaN(parsed) ? null : parsed)
    }

    return (
        <TextField
            sx={{margin: 1, width: 80}}
            data-testid="level-input"
            label="Level"
            type="number"
            InputProps={{inputProps: {min: 1, max: 100}}}
            value={level || ""}
            onChange={value => onChange(value.target.value)}
        />
    )
}
