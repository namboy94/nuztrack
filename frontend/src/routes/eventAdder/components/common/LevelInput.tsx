import {TextField} from "@mui/material";
import React from "react";

export interface LevelInputProps {
    level: number
    setLevel: (level: number) => void
}

export function LevelInput(props: LevelInputProps) {

    const {level, setLevel} = props

    return (
        <TextField
            sx={{margin: 1, width: 80}}
            data-testid="level-input"
            label="Level"
            type="number"
            value={level}
            onChange={x => setLevel(parseInt(x.target.value))}
        />
    )
}