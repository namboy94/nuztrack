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

interface AddEncounterDialogProps {
    open: boolean
    onClose: () => void
    pokedex: Pokedex
    natures: PokemonNatures
    locations: GameLocation[]
}

export default function AddEncounterDialog(props: AddEncounterDialogProps) {

    const locationMap = new Map<string, GameLocation>();
    props.locations.forEach(x => locationMap.set(x.name, x))

    const pokemonNameToPokedexIdMap = new Map<string, number>()
    props.pokedex.forEach((value, key) => {
        pokemonNameToPokedexIdMap.set(value.name, key)
    })

    const locations = Array.from(locationMap.keys())
    const natures = props.natures

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

        setLocation(newLocation);
        if (locationMap.has(newLocation)) {
            reset()
            const locationEncounters = locationMap.get(newLocation)!!.encounters
            setEncounters(locationEncounters.map(x => props.pokedex.get(x)!!.name))
        } else {
            setEncounters(allEncounters)
        }
    }

    const selectPokemon = (newPokemon: string | null) => {

        if (newPokemon === null) {
            reset()
            return;
        }

        setPokemon(newPokemon)
        setAbilities([])

        if (pokemonNameToPokedexIdMap.has(newPokemon)) {
            const currentLocation = location.toString()
            reset()
            setLocation(currentLocation)
            const pokedexId = pokemonNameToPokedexIdMap.get(newPokemon)!!
            const newAbilities = props.pokedex.get(pokedexId)!!.abilities
            const abilitiesList = [
                newAbilities.primary,
                newAbilities.secondary,
                newAbilities.hidden
            ]
            setAbilities(abilitiesList.filter(x => x !== null).map(x => x!!))
        }
    }

    const submit = () => {
        const payload = {
            location: location,
            pokemon: pokemonNameToPokedexIdMap.get(pokemon),
            level: level,
            gender: gender,
            caught: caught,
            nature: nature,
            ability: ability,
            nickname: nickname
        }
        console.log(payload)
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
                    onChange={x => setLocation(x.target.value)}
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