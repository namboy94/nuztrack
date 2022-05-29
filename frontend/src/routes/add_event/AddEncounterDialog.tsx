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

interface AddEncounterDialogProps {
    open: boolean
    onClose: () => void
}

export default function AddEncounterDialog(props: AddEncounterDialogProps) {

    const locations = ["A", "B", "C"]
    const species = ["Bulbasaur", "Charmander", "Squirtle"]
    const natures = ["Adamant", "Modest"]
    const abilities = ["Chlorophyll", "Prankster"]

    const [location, setLocation] = useState("")
    const [pokemon, setPokemon] = useState("")
    const [level, setLevel] = useState(5)
    const [caught, setCaught] = useState(false)
    const [nickname, setNickname] = useState("")
    const [nature, setNature] = useState("")
    const [ability, setAbility] = useState("")

    const submit = () => {
    }

    const onClose = () => {
        setLocation("")
        setPokemon("")
        setLevel(5)
        setCaught(false)
        setNickname("")
        setNature("")
        setAbility("")
        props.onClose()
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Encounter</DialogTitle>
            <Autocomplete
                freeSolo
                options={locations}
                renderInput={(params) => <TextField
                    {...params} label="Location" value={location}
                    onChange={x => setLocation(x.target.value)}
                />}
            />
            <Autocomplete
                options={species}
                renderInput={(params) => <TextField
                    {...params} label="Pokemon" value={pokemon}
                    onChange={x => setPokemon(x.target.value)}
                />}
            />
            <TextField
                label="Level" type="number" value={level}
                onChange={x => setLevel(parseInt(x.target.value))}
            />

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