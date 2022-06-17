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
import {Natures, Pokedex} from "../../../data/pokedex/pokedex.model";
import {GameLocation} from "../../../data/games/games.model";

export interface EncounterEventDialogProps {
    open: boolean
    onClose: () => void
    state: EncounterEventDialogState
    submit: () => void
    pokedex: Pokedex | undefined
    natures: Natures | undefined
    locations: GameLocation[]
}

export interface EncounterEventDialogState {
    location: string
    setLocation: (location: string) => void
    pokemonSpecies: number
    setPokemonSpecies: (pokedexNumber: number) => void
    level: number
    setLevel: (level: number) => void
    gender: Gender
    setGender: (gender: Gender) => void
    caught: boolean
    setCaught: (caught: boolean) => void
    nickname: string
    setNickname: (nickname: string) => void
    nature: string,
    setNature: (nature: string) => void
    abilitySlot: number
    setAbilitySlot: (abilitySlot: number) => void
    reset: () => void
}

export function EncounterEventDialog(props: EncounterEventDialogProps) {

    const {state, open, onClose} = props

    return (<Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Encounter Event</DialogTitle>
        <Autocomplete
            freeSolo
            options={locations}
            onChange={(_, newLocation) => selectLocation(newLocation)}
            renderInput={(params) => <TextField
                {...params} label="Location" value={location}
                onChange={x => selectLocation(x.target.value)}
            />}
        />
        <Autocomplete
            freeSolo
            options={encounters}
            onChange={(_, newPokemon) => selectPokemon(newPokemon)}
            renderInput={(params) => <TextField
                {...params} label="Pokemon" value={pokemon}
                onChange={x => selectPokemon(x.target.value)}
            />}
        />
        <TextField
            label="Level" type="number" value={level}
            onChange={x => setLevel(parseInt(x.target.value))}
        />
        <Select fullWidth value={gender} onChange={x => setGender(x.target.value)}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Neutral">Neutral</MenuItem>
        </Select>

        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    name="caught"
                    checked={caught}
                    value={caught}
                    onChange={x => setCaught(x.target.checked)}/>
            } label="Caught?"/>
        </FormGroup>

        <Collapse in={caught}>
            <TextField label="Nickname" value={nickname} onChange={x => setNickname(x.target.value)}/>
            <Select fullWidth value={nature} onChange={x => setNature(x.target.value)}>
                {natures.map((x: string) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
            </Select>
            <Select fullWidth value={ability} onChange={x => setAbility(x.target.value)}>
                {abilities.map((x: string) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
            </Select>
        </Collapse>

        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={submit}>Add</Button>
        </DialogActions>
    </Dialog>)
}