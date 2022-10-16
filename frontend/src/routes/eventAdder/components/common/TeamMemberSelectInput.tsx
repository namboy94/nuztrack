import {Autocomplete, Box, TextField} from "@mui/material";
import React from "react";
import {TeamMember} from "../../../../data/team/team.model";

export interface TeamMemberSelectInputProps {
    teamMember: TeamMember | null
    setTeamMember: (teamMember: TeamMember | null) => void
    activeTeamMembers: TeamMember[]
    boxedTeamMembers: TeamMember[]
}

export function TeamMemberSelectInput(props: TeamMemberSelectInputProps) {
    return (
        <Autocomplete
            sx={{margin: 1}}
            data-testid="team-member-input"
            value={props.teamMember}
            options={[...props.activeTeamMembers, ...props.boxedTeamMembers]}
            groupBy={member => props.activeTeamMembers.includes(member) ? "Active" : "Boxed"}
            renderOption={(p, option) => (
                <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...p}>
                    <img
                        loading="lazy"
                        width="100"
                        src={option.sprite}
                        alt={option.nickname}
                    />
                    {option.nickname}
                </Box>
            )}
            getOptionLabel={member => member?.nickname ?? ""}
            onChange={(_, member) => props.setTeamMember(member)}
            renderInput={(params) => <TextField{...params} label="Pokemon"/>}
        />
    )
}