import {
    Autocomplete,
    Button,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import React from "react";
import {Gender} from "../../../data/team/team.model";
import {Pokedex, PokemonSpecies} from "../../../data/pokedex/pokedex.model";
import {NuzlockeRun} from "../../../data/runs/runs.model";

export interface EncounterEventDialogProps {
    open: boolean
    onClose: () => void
    run: NuzlockeRun,
    state: EncounterEventDialogState
    submit: () => void
    pokedex: Pokedex | undefined
    natures: string[] | undefined
    locations: string[]
}

export interface EncounterEventDialogState {
    location: string
    setLocation: (location: string) => void
    possibleEncounters: PokemonSpecies[]
    pokemonSpecies: PokemonSpecies | undefined
    setPokemonSpecies: (pokemonSpecies: PokemonSpecies | undefined) => void
    level: number
    setLevel: (level: number) => void
    gender: Gender
    setGender: (gender: Gender) => void
    caught: boolean
    setCaught: (caught: boolean) => void
    nickname: string
    setNickname: (nickname: string) => void
    nature: string
    setNature: (nature: string) => void
    abilitySlot: number
    setAbilitySlot: (abilitySlot: number) => void
    possibleAbilitySlots: number[]
    reset: () => void
}

export function EncounterEventDialog(props: EncounterEventDialogProps) {

    const {state, open, onClose, submit, pokedex, natures, locations} = props

    if (pokedex === undefined || natures === undefined) {
        return <></>
    }


    return (<Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Encounter Event</DialogTitle>
        <Autocomplete
            data-testid="location-input"
            freeSolo
            options={locations}
            onChange={(_, newLocation) => state.setLocation(newLocation ?? "")}
            value={state.location}
            renderInput={(params) => <TextField{...params} label="Location"/>}
        />
        <Autocomplete
            data-testid="pokemon-species-input"
            disableClearable
            value={state.pokemonSpecies}
            options={pokedex.getAllSpecies()}
            getOptionLabel={pokemon => pokemon?.name ?? ""}
            onChange={(_, newPokemon) => state.setPokemonSpecies(newPokemon)}
            renderInput={(params) => <TextField{...params} label="Pokemon"/>}
        />
        <TextField
            data-testid="level-input"
            label="Level"
            type="number"
            value={state.level}
            onChange={x => state.setLevel(parseInt(x.target.value))}
        />
        {props.run.game.generation > 1 &&
            <Select
                data-testid="gender-input"
                fullWidth
                value={state.gender}
                onChange={x => state.setGender(x.target.value as Gender)}
            >
                <MenuItem value={Gender.MALE}>Male</MenuItem>
                <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                <MenuItem value={Gender.NEUTRAL}>Neutral</MenuItem>
            </Select>
        }
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    data-testid="caught-input"
                    name="caught"
                    checked={state.caught}
                    value={state.caught}
                    onChange={x => state.setCaught(x.target.checked)}/>
            } label="Caught?"/>
        </FormGroup>

        <Collapse in={state.caught}>
            <TextField
                data-testid="nickname-input"
                label="Nickname"
                value={state.nickname}
                onChange={x => state.setNickname(x.target.value)}
            />
            {props.run.game.generation > 2 &&
                <>
                    <Autocomplete
                        data-testid="nature-input"
                        disableClearable
                        value={state.nature}
                        options={natures}
                        onChange={(_, newNature) => state.setNature(newNature)}
                        renderInput={(params) => <TextField{...params} label="Nature"/>}
                    />
                    <Autocomplete
                        data-testid="ability-slot-input"
                        disableClearable
                        value={state.abilitySlot}
                        options={state.possibleAbilitySlots}
                        getOptionLabel={abilitySlot =>
                            pokedex.getAbilityName(state.pokemonSpecies?.pokedexNumber ?? -1, abilitySlot)
                        }
                        onChange={(_, newSlot) => state.setAbilitySlot(newSlot)}
                        renderInput={(params) => <TextField{...params} label="Nature"/>}
                    />
                </>
            }
        </Collapse>

        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={submit}>Add</Button>
        </DialogActions>
    </Dialog>)
}