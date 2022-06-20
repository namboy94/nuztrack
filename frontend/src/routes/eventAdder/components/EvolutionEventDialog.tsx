import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";
import {LocationInput} from "./common/LocationInput";
import {LevelInput} from "./common/LevelInput";
import {TeamMember} from "../../../data/team/team.model";
import {Pokedex, PokemonSpecies} from "../../../data/pokedex/pokedex.model";
import {PokemonSpeciesSelectInput} from "./common/PokemonSpeciesSelectInput";
import {TeamMemberSelectInput} from "./common/TeamMemberSelectInput";

export interface EvolutionEventDialogProps {
    open: boolean
    onClose: () => void
    pokedex: Pokedex | undefined
    locations: string[]
    state: EvolutionEventDialogState
    activeTeamMembers: TeamMember[]
    boxedTeamMembers: TeamMember[]
    submit: () => void
}

export interface EvolutionEventDialogState {
    location: string
    setLocation: (location: string) => void
    level: number
    setLevel: (level: number) => void
    teamMember: TeamMember | null
    setTeamMember: (teamMember: TeamMember | null) => void
    evolutionTarget: PokemonSpecies | null
    setEvolutionTarget: (species: PokemonSpecies | null) => void
    reset: () => void
}

export function EvolutionEventDialog(props: EvolutionEventDialogProps) {

    const {open, onClose, state, locations, activeTeamMembers, boxedTeamMembers, submit, pokedex} = props

    if (pokedex === undefined) {
        return <></>
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Add Evolution</DialogTitle>
            <LocationInput location={state.location} setLocation={state.setLocation} locations={locations}/>
            <TeamMemberSelectInput
                teamMember={state.teamMember}
                setTeamMember={state.setTeamMember}
                activeTeamMembers={activeTeamMembers}
                boxedTeamMembers={boxedTeamMembers}
                pokedex={pokedex}
            />
            <LevelInput level={state.level} setLevel={state.setLevel}/>
            <PokemonSpeciesSelectInput
                pokemonSpecies={state.evolutionTarget}
                setPokemonSpecies={state.setEvolutionTarget}
                pokemonSpeciesOptions={
                    state.teamMember !== null
                        ? pokedex.getEvolutionSpecies(state.teamMember.pokedexNumber)
                        : []
                }
                groupFn={_ => "Targets"}
            />
            <DialogActions>
                <Button data-testid="cancel-button" onClick={onClose}>Cancel</Button>
                <Button data-testid="submit-button" onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}