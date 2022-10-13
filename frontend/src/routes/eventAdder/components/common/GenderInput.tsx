import {Gender} from "../../../../data/team/team.model";
import {MenuItem, Select} from "@mui/material";
import React from "react";

export interface GenderInputProps {
    gender: Gender,
    onChangeGender: (newGender: Gender) => void
}

export function GenderInput(props: GenderInputProps) {
    return (
        <Select
            sx={{margin: 1, width: 60}}
            data-testid="gender-input"
            fullWidth
            value={props.gender}
            onChange={x => props.onChangeGender(x.target.value as Gender)}
        >
            <MenuItem data-testid="male-gender-select" value={Gender.MALE}>♂</MenuItem>
            <MenuItem data-testid="female-gender-select" value={Gender.FEMALE}>♀</MenuItem>
            <MenuItem data-testid="neutral-gender-select" value={Gender.NEUTRAL}>N</MenuItem>
        </Select>
    )
}