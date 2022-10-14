import {Dialog, DialogTitle, TextField} from "@mui/material";
import {LocationInput} from "./common/LocationInput";
import {TeamMemberSelectInput} from "./common/TeamMemberSelectInput";
import {LevelInput} from "./common/LevelInput";
import React from "react";
import {DeathEventDialogViewModel} from "../hooks/vm/DeathEventDialog.vm";
import {SubmitCancelDialogActions} from "./common/SubmitCancelDialogActions";


export function DeathEventDialog(props: DeathEventDialogViewModel) {
    const {state, interactions} = props

    return (
        <Dialog open={state.open} onClose={interactions.closeDialog} fullWidth>
            <DialogTitle>Add Death</DialogTitle>
            <LocationInput location={state.location}
                           setLocation={interactions.onChangeLocation}
                           locations={state.locations}/>
            <TeamMemberSelectInput
                teamMember={state.teamMember}
                setTeamMember={interactions.onChangeTeamMember}
                activeTeamMembers={state.activeTeamMembers}
                boxedTeamMembers={state.boxedTeamMembers}
                pokedex={state.pokedex}
            />
            <LevelInput level={state.level} setLevel={interactions.onChangeLevel}/>
            <TextField
                data-testid="opponent-input"
                multiline
                label="Opponent"
                value={state.opponent}
                onChange={x => interactions.onChangeOpponent(x.target.value)}/>
            <TextField
                data-testid="description-input"
                label="Description"
                value={state.description}
                onChange={x => interactions.onChangeDescription(x.target.value)}/>
            <SubmitCancelDialogActions closeDialog={interactions.closeDialog} submit={interactions.submit}/>
        </Dialog>
    )
}