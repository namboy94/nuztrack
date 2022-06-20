import {Autocomplete, Box, TextField} from "@mui/material";
import React from "react";
import {TeamMember} from "../../../../data/team/team.model";
import {Pokedex} from "../../../../data/pokedex/pokedex.model";

export interface TeamMemberSelectInputProps {
    teamMember: TeamMember | null
    setTeamMember: (teamMember: TeamMember | null) => void
    activeTeamMembers: TeamMember[]
    boxedTeamMembers: TeamMember[]
    pokedex: Pokedex
}

export function TeamMemberSelectInput(props: TeamMemberSelectInputProps) {

    const {teamMember, activeTeamMembers, boxedTeamMembers, setTeamMember, pokedex} = props

    return (
        <Autocomplete
            sx={{margin: 1}}
            data-testid="team-member-input"
            value={teamMember}
            options={[...activeTeamMembers, ...boxedTeamMembers]}
            groupBy={member => activeTeamMembers.includes(member) ? "Active" : "Boxed"}
            renderOption={(p, option) => (
                <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...p}>
                    <img
                        loading="lazy"
                        width="100"
                        src={pokedex.getSpecies(option.pokedexNumber).sprite}
                        alt={option.nickname}
                    />
                    {option.nickname}
                </Box>
            )}
            getOptionLabel={member => member?.nickname ?? ""}
            onChange={(_, member) => setTeamMember(member)}
            renderInput={(params) => <TextField{...params} label="Pokemon"/>}
        />
    )
}