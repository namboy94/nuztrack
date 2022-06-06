import {Autocomplete, Button, Dialog, DialogActions, DialogTitle, MenuItem, Select, TextField} from "@mui/material";
import React, {useState} from "react";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {GameLocation} from "../../api/games/gamesTypes";

interface AddDeathDialogProps {
    open: boolean
    onClose: () => void
    displaySnack: (message: string, severity: Severity) => void
    run: NuzlockeRun
    locations: GameLocation[]
}

export default function AddDeathDialog(props: AddDeathDialogProps) {

    const myPokemon = ["Bulba", "Char", "Squi"]
    const locations = ["Pallet", "Celadon"]

    const [deadPokemon, setDeadPokemon] = useState("")
    const [location, setLocation] = useState("")
    const [level, setLevel] = useState(5)
    const [opponent, setOpponent] = useState("")
    const [description, setDescription] = useState("")

    const submit = () => {
    }

    const onClose = () => {
        setDeadPokemon("")
        setLocation("")
        setLevel(5)
        setOpponent("")
        setDescription("")
        props.onClose()
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Death</DialogTitle>
            <Select fullWidth value={deadPokemon} onChange={x => setDeadPokemon(x.target.value)}>
                {myPokemon.map((x: string) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
            </Select>
            <Autocomplete
                freeSolo
                options={locations}
                renderInput={(params) => <TextField
                    {...params} label="Location" value={location}
                    onChange={x => setLocation(x.target.value)}
                />}
            />
            <TextField
                label="Level" type="number" value={level}
                onChange={x => setLevel(parseInt(x.target.value))}
            />
            <TextField label="Opponent" value={opponent} onChange={x => setOpponent(x.target.value)}/>
            <TextField multiline label="Description" value={description}
                       onChange={x => setDescription(x.target.value)}/>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}