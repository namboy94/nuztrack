import {TeamMember} from "../../../data/team/team.model";
import {Button, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import {LocationInput} from "./common/LocationInput";
import {TeamMemberSelectInput} from "./common/TeamMemberSelectInput";
import {LevelInput} from "./common/LevelInput";
import React from "react";
import {Pokedex} from "../../../data/pokedex/pokedex.model";

export interface DeathEventDialogProps {
    open: boolean
    onClose: () => void
    state: DeathEventDialogState
    submit: () => void,
    activeTeamMembers: TeamMember[]
    boxedTeamMembers: TeamMember[]
    pokedex: Pokedex | undefined
    locations: string[]
}

export interface DeathEventDialogState {
    location: string
    setLocation: (location: string) => void
    level: number
    setLevel: (level: number) => void
    teamMember: TeamMember | null
    setTeamMember: (teamMember: TeamMember | null) => void
    opponent: string
    setOpponent: (opponent: string) => void
    description: string
    setDescription: (description: string) => void
    reset: () => void
}

export function DeathEventDialog(props: DeathEventDialogProps) {
    const {open, onClose, state, submit, activeTeamMembers, boxedTeamMembers, pokedex, locations} = props

    if (pokedex === undefined) {
        return <></>
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Add Death</DialogTitle>
            <LocationInput location={state.location} setLocation={state.setLocation} locations={locations}/>
            <TeamMemberSelectInput
                teamMember={state.teamMember}
                setTeamMember={state.setTeamMember}
                activeTeamMembers={activeTeamMembers}
                boxedTeamMembers={boxedTeamMembers}
                pokedex={pokedex}
            />
            <LevelInput level={state.level} setLevel={state.setLevel}/>
            <TextField
                data-testid="opponent-input"
                multiline
                label="Opponent"
                value={state.opponent}
                onChange={x => state.setOpponent(x.target.value)}/>
            <TextField
                data-testid="description-input"
                label="Description"
                value={state.description}
                onChange={x => state.setDescription(x.target.value)}/>
            <DialogActions>
                <Button data-testid="cancel-button" onClick={onClose}>Cancel</Button>
                <Button data-testid="submit-button" onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}