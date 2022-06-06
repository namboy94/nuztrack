import {Autocomplete, Button, Dialog, DialogActions, DialogTitle, MenuItem, Select, TextField} from "@mui/material";
import React, {useState} from "react";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {GameLocation} from "../../api/games/gamesTypes";
import {Team} from "../../api/team_member/teamMemberTypes";
import {CreateDeathEvent} from "../../api/events/death/deathEventTypes";
import {createDeathEvent} from "../../api/events/death/deathEventApi";

interface AddDeathDialogProps {
    open: boolean
    onClose: () => void
    displaySnack: (message: string, severity: Severity) => void
    run: NuzlockeRun
    locations: GameLocation[]
    team: Team
}

export default function AddDeathDialog(props: AddDeathDialogProps) {

    const alivePokemon = props.team.active.concat(props.team.boxed)
    const myPokemonMap = new Map<string, number>()
    alivePokemon.forEach(x => myPokemonMap.set(x.nickname, x.id))

    const [deadPokemon, setDeadPokemon] = useState("")
    const [location, setLocation] = useState("")
    const [level, setLevel] = useState(5)
    const [opponent, setOpponent] = useState("")
    const [description, setDescription] = useState("")

    const submit = () => {
        const payload: CreateDeathEvent = {
            location: location,
            teamMemberId: myPokemonMap.get(deadPokemon)!!,
            opponent: opponent,
            description: description,
            level: level
        }
        createDeathEvent(props.run.id, payload).then(
            success => {
                props.displaySnack("Death created successfully", "info")
                onClose()
            },
            error => {
                props.displaySnack(error.toString(), "error")
            }
        )
        console.log(payload)
    }

    const onClose = () => {
        setDeadPokemon("")
        setLocation("")
        setLevel(5)
        setOpponent("")
        setDescription("")
        props.onClose()
    }

    const selectLocation = (text: string | null) => {
        if (text !== null) {
            setLocation(text)
        }
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Death</DialogTitle>
            <Select fullWidth value={deadPokemon} onChange={x => setDeadPokemon(x.target.value)}>
                {Array.from(myPokemonMap.keys()).map((x: string) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
            </Select>
            <Autocomplete
                freeSolo
                options={props.locations.map(x => x.name)}
                onChange={(_, newLocation) => selectLocation(newLocation)}
                renderInput={(params) => <TextField
                    {...params} label="Location" value={location}
                    onChange={x => selectLocation(x.target.value)}
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