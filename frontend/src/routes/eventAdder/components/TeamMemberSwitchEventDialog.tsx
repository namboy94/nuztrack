import {SwitchType} from "../../../data/events/events.model";
import {TeamMember} from "../../../data/team/team.model";
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";
import {TeamMemberSelectInput} from "./common/TeamMemberSelectInput";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {LocationInput} from "./common/LocationInput";

export interface TeamMemberSwitchEventDialogProps {
    open: boolean
    onClose: () => void
    mode: SwitchType
    state: TeamMemberSwitchEventDialogState
    activeTeamMembers: TeamMember[]
    boxedTeamMembers: TeamMember[]
    pokedex: Pokedex | undefined
    locations: string[]
    submit: () => void
}

export interface TeamMemberSwitchEventDialogState {
    teamMember: TeamMember | null
    setTeamMember: (teamMember: TeamMember | null) => void
    location: string,
    setLocation: (location: string) => void
    reset: () => void
}

export function TeamMemberSwitchEventDialog(props: TeamMemberSwitchEventDialogProps) {
    const {open, onClose, mode, state, submit, pokedex, locations, activeTeamMembers, boxedTeamMembers} = props

    if (pokedex === undefined) {
        return <></>
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {mode == SwitchType.ADD ? "Add Team Member to Party" : "Remove Team Member from Party"}
            </DialogTitle>
            <LocationInput location={state.location} setLocation={state.setLocation} locations={locations}/>
            <TeamMemberSelectInput
                teamMember={state.teamMember}
                setTeamMember={state.setTeamMember}
                activeTeamMembers={mode == SwitchType.REMOVE ? activeTeamMembers : []}
                boxedTeamMembers={mode == SwitchType.ADD ? boxedTeamMembers : []}
                pokedex={pokedex}
            />
            <DialogActions>
                <Button data-testid="cancel-button" onClick={onClose}>Cancel</Button>
                <Button data-testid="submit-button" onClick={submit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}