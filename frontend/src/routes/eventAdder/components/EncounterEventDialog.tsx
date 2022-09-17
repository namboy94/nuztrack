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
    Grid,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import React from "react";
import {Gender} from "../../../data/team/team.model";
import {Pokedex, PokemonSpecies} from "../../../data/pokedex/pokedex.model";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {LocationInput} from "./common/LocationInput";
import {PokemonSpeciesSelectInput} from "./common/PokemonSpeciesSelectInput";

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
    pokemonSpecies: PokemonSpecies | null
    setPokemonSpecies: (pokemonSpecies: PokemonSpecies | null) => void
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
        <Grid container direction="column">
            <LocationInput location={state.location} setLocation={state.setLocation} locations={locations}/>
            <PokemonSpeciesSelectInput
                pokemonSpecies={state.pokemonSpecies}
                setPokemonSpecies={state.setPokemonSpecies}
                pokemonSpeciesOptions={[
                    ...pokedex.getAllSpecies().filter(x => state.possibleEncounters.includes(x)),
                    ...pokedex.getAllSpecies().filter(x => !state.possibleEncounters.includes(x))
                ]}
                groupFn={species => state.possibleEncounters.includes(species) ? state.location : "All"}
            />
            <Grid container spacing={0}>
                <Grid item>
                    {/*<LevelInput level={state.level} setLevel={state.setLevel}/>*/}
                    {/*TODO Re-Add*/}
                </Grid>
                <Grid item>
                    {props.run.game.generation > 1 &&
                        <Select
                            sx={{margin: 1, width: 60}}
                            data-testid="gender-input"
                            fullWidth
                            value={state.gender}
                            onChange={x => state.setGender(x.target.value as Gender)}
                        >
                            <MenuItem data-testid="male-gender-select" value={Gender.MALE}>♂</MenuItem>
                            <MenuItem data-testid="female-gender-select" value={Gender.FEMALE}>♀</MenuItem>
                            <MenuItem data-testid="neutral-gender-select" value={Gender.NEUTRAL}>N</MenuItem>
                        </Select>
                    }
                </Grid>
                <Grid item>
                    <FormGroup sx={{margin: 1}}>
                        <FormControlLabel control={
                            <Checkbox
                                data-testid="caught-input"
                                name="caught"
                                checked={state.caught}
                                value={state.caught}
                                onChange={x => state.setCaught(x.target.checked)}/>
                        } label="Caught?"/>
                    </FormGroup>
                </Grid>
            </Grid>

            <Collapse in={state.caught}>
                <hr/>
                <TextField
                    sx={{margin: 1, width: 315}}
                    data-testid="nickname-input"
                    label="Nickname"
                    value={state.nickname}
                    onChange={x => state.setNickname(x.target.value)}
                />
                {props.run.game.generation > 2 &&
                    <Grid container>
                        <Grid item>
                            <Autocomplete
                                sx={{margin: 1, width: 140}}
                                data-testid="nature-input"
                                disableClearable
                                value={state.nature}
                                options={natures}
                                onChange={(_, newNature) => state.setNature(newNature)}
                                renderInput={(params) =>
                                    <TextField{...params} label="Nature"/>
                                }
                            />
                        </Grid>
                        <Grid>
                            <Autocomplete
                                sx={{margin: 1, width: 160}}
                                data-testid="ability-slot-input"
                                disableClearable
                                value={state.abilitySlot}
                                options={state.possibleAbilitySlots}
                                getOptionLabel={abilitySlot =>
                                    pokedex.getAbilityName(state.pokemonSpecies?.pokedexNumber ?? -1, abilitySlot)
                                }
                                onChange={(_, newSlot) => state.setAbilitySlot(newSlot)}
                                renderInput={(params) =>
                                    <TextField{...params} label="Ability"/>
                                }
                            />
                        </Grid>
                    </Grid>
                }
            </Collapse>
            <DialogActions>
                <Button data-testid="cancel-button" onClick={onClose}>Cancel</Button>
                <Button data-testid="submit-button" onClick={submit}>Add</Button>
            </DialogActions>
        </Grid>
    </Dialog>)
}