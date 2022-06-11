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
import React, {useState} from "react";
import {Pokedex, PokemonNatures} from "../../api/pokedex/pokedexTypes";
import {GameLocation} from "../../api/games/gamesTypes";
import {CreateEncounterEvent, CreateEncounterPokemon} from "../../api/events/encounter/encounterEventTypes";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {createEncounterEvent} from "../../api/events/encounter/encounterEventApi";

interface AddEncounterDialogProps {
    open: boolean
    onClose: () => void
    pokedex: Pokedex
    natures: PokemonNatures
    locations: GameLocation[]
    displaySnack: (message: string, severity: Severity) => void
    run: NuzlockeRun
}

export default function AddEncounterDialog(props: AddEncounterDialogProps) {

    const locationMap = new Map<string, GameLocation>();
    props.locations.forEach(x => locationMap.set(x.name, x))
    const locations = Array.from(locationMap.keys())
    const natures = props.natures

    const pokemonNameToPokedexIdMap = new Map<string, number>()
    props.pokedex.forEach((value, key) => {
        pokemonNameToPokedexIdMap.set(value.name, key)
    })

    const allEncounters = Array.from(pokemonNameToPokedexIdMap.keys())
    const [encounters, setEncounters] = useState(allEncounters)
    const [abilities, setAbilities] = useState<string[]>([])

    const [location, setLocation] = useState("")
    const [pokemon, setPokemon] = useState("")
    const [level, setLevel] = useState(5)
    const [caught, setCaught] = useState(false)
    const [nickname, setNickname] = useState("")
    const [nature, setNature] = useState("")
    const [ability, setAbility] = useState("")
    const [gender, setGender] = useState("Male")

    const reset = () => {
        setLocation("")
        setPokemon("")
        setLevel(5)
        setCaught(false)
        setNickname("")
        setNature("")
        setAbility("")
        setGender("Male")
    }

    const onClose = () => {
        reset()
        props.onClose()
    }

    const selectLocation = (newLocation: string | null) => {

        setEncounters(allEncounters)
        reset()
        if (newLocation === null) {
            return
        }


        if (locationMap.has(newLocation)) {
            reset()
            setLocation(newLocation);
            const locationEncounters = locationMap.get(newLocation)!!.encounters
            setEncounters(locationEncounters.map(x => props.pokedex.get(x)!!.name))
        } else {
            setLocation(newLocation);
            setEncounters(allEncounters)
        }
    }

    const selectPokemon = (newPokemon: string | null) => {
        if (newPokemon === null) {
            reset()
            return;
        }

        if (pokemonNameToPokedexIdMap.has(newPokemon)) {
            const currentLocation = location.toString()
            reset()
            setPokemon(newPokemon)
            setLocation(currentLocation)
            const pokedexId = pokemonNameToPokedexIdMap.get(newPokemon)!!
            const newAbilities = props.pokedex.get(pokedexId)!!.abilities
            const abilitiesList = Array.from(newAbilities.values())
            setAbilities(abilitiesList.filter(x => x !== null).map(x => x!!))
        } else {
            setPokemon(newPokemon)
            setAbilities([])
        }
    }

    const submit = () => {
        const pokedexNumber = pokemonNameToPokedexIdMap.get(pokemon)

        if (pokedexNumber === undefined) {
            props.displaySnack("No valid Pokemon selected", "error")
            return
        }

        const species = props.pokedex.get(pokedexNumber!!)!!
        const abilitiesMap = new Map<string, number>()
        species.abilities.forEach((value, key) => {
            if (value !== null) {
                abilitiesMap.set(value, key)
            }
        })

        let pokemonCreator: CreateEncounterPokemon | null = null
        if (caught) {
            pokemonCreator = {
                nature: nature,
                nickname: nickname,
                abilitySlot: abilitiesMap.get(ability)!!
            }
        }

        const payload: CreateEncounterEvent = {
            location: location,
            pokedexNumber: pokedexNumber!!,
            level: level,
            gender: gender,
            caught: caught,
            pokemon: pokemonCreator
        }
        console.log(payload)
        createEncounterEvent(props.run.id, payload).then(
            success => {
                onClose();
                props.displaySnack("Event created successfully", "info")
            },
            error => {
                props.displaySnack(error.toString(), "error")
            }
        )
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Encounter</DialogTitle>
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
        </Dialog>
    )
}