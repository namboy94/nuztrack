import {SwitchType} from "../../../data/events/events.model";
import {Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";
import {TeamMemberSelectInput} from "./common/TeamMemberSelectInput";
import {LocationInput} from "./common/LocationInput";
import {TeamMemberSwitchEventDialogViewModel} from "../hooks/vm/TeamMemberSwitchEventDialog.vm";
import {CancelButton, SubmitButton} from "../../common/inputs/Button";

export function TeamMemberSwitchEventDialog(props: TeamMemberSwitchEventDialogViewModel) {
    const {state, interactions} = props

    return (
        <Dialog open={state.open} onClose={interactions.closeDialog}>
            <DialogTitle>
                {state.mode == SwitchType.ADD ? "Add Team Member to Party" : "Remove Team Member from Party"}
            </DialogTitle>
            <LocationInput location={state.location} setLocation={interactions.onChangeLocation}
                           locations={state.locations}/>
            <TeamMemberSelectInput
                teamMember={state.teamMember}
                setTeamMember={interactions.onChangeTeamMember}
                activeTeamMembers={state.mode == SwitchType.REMOVE ? state.activeTeamMembers : []}
                boxedTeamMembers={state.mode == SwitchType.ADD ? state.boxedTeamMembers : []}
                pokedex={state.pokedex}
            />
            <DialogActions>
                <CancelButton onClick={interactions.closeDialog}/>
                <SubmitButton onClick={interactions.submit}/>
            </DialogActions>
        </Dialog>
    )
}