import {Dialog, DialogTitle} from "@mui/material";
import React from "react";
import {LocationInput} from "./common/LocationInput";
import {PokemonSpeciesSelectInput} from "./common/PokemonSpeciesSelectInput";
import {TeamMemberSelectInput} from "./common/TeamMemberSelectInput";
import {EvolutionEventDialogViewModel} from "../hooks/vm/EvolutionEventDialog.vm";
import {LevelInput} from "./common/LevelInput";
import {SubmitCancelDialogActions} from "./common/SubmitCancelDialogActions";


export function EvolutionEventDialog(props: EvolutionEventDialogViewModel) {

    const {state, interactions} = props

    return (
        <Dialog open={state.open} onClose={interactions.closeDialog} fullWidth>
            <DialogTitle>Add Evolution</DialogTitle>
            <LocationInput location={state.location}
                           setLocation={interactions.onChangeLocation}
                           locations={state.locations}/>
            <TeamMemberSelectInput
                teamMember={state.teamMember}
                setTeamMember={interactions.onChangeTeamMember}
                activeTeamMembers={state.activeTeamMembers}
                boxedTeamMembers={state.boxedTeamMembers}
            />
            <LevelInput level={state.level} setLevel={interactions.onChangeLevel}/>
            <PokemonSpeciesSelectInput
                pokemonSpecies={state.evolutionTarget}
                setPokemonSpecies={interactions.onChangeEvolutionTarget}
                pokemonSpeciesOptions={
                    state.teamMember !== null
                        ? state.pokedex.getEvolutionSpecies(state.teamMember.pokedexNumber)
                        : []
                }
                groupFn={_ => "Targets"}
            />
            <SubmitCancelDialogActions closeDialog={interactions.closeDialog} submit={interactions.submit}/>
        </Dialog>
    )
}