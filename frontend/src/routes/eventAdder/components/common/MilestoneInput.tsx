import {Milestone} from "../../../../data/games/games.model";
import {Autocomplete, Box, TextField} from "@mui/material";
import React from "react";

export interface MilestoneInputProps {
    milestone: Milestone | null
    milestones: Milestone[]
    onChangeMilestone: (newMilestone: Milestone | null) => void
}

export function MilestoneInput(props: MilestoneInputProps) {
    return (<Autocomplete
        data-testid="milestone-input"
        value={props.milestone}
        options={props.milestones}
        renderOption={(p, option) => (
            <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...p}>
                <img
                    loading="lazy"
                    width="100"
                    src={option.image}
                    alt={option.name}
                />
                {option.name}
            </Box>
        )}
        getOptionLabel={milestone => milestone.name}
        onChange={(_, milestone) => props.onChangeMilestone(milestone)}
        renderInput={(params) => <TextField{...params} label="Milestone"/>}
    />)
}