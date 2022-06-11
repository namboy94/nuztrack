import {Autocomplete, Button, Dialog, DialogActions, DialogTitle, MenuItem, Select, TextField} from "@mui/material";
import React, {useState} from "react";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {GameLocation} from "../../api/games/gamesTypes";
import {Team, TeamMember} from "../../api/team_member/teamMemberTypes";
import {CreateEvolutionEvent} from "../../api/events/evolution/evolutionEventTypes";
import {createEvolutionEvent} from "../../api/events/evolution/evolutionEventApi";
import {Pokedex} from "../../api/pokedex/pokedexTypes";

interface AddEvolutionDialogProps {
    open: boolean
    onClose: () => void
    displaySnack: (message: string, severity: Severity) => void
    run: NuzlockeRun
    locations: GameLocation[]
    team: Team
    pokedex: Pokedex
}

export default function AddEvolutionDialog(props: AddEvolutionDialogProps) {

    const alivePokemon = props.team.active.concat(props.team.boxed)
    const evoMap = new Map<number, number[]>()
    alivePokemon.forEach(x => evoMap.set(x.id, props.pokedex.get(x.pokedexNumber)!!.evolutions))

    const [teamMember, setTeamMember] = useState<TeamMember>()
    const [location, setLocation] = useState("")
    const [level, setLevel] = useState(5)
    const [newPokedexNumber, setNewPokedexNumber] = useState(0)
    const [availableEvolutions, setAvailableEvolutions] = useState<number[]>([])

    const submit = () => {

        if (teamMember === undefined) {
            return
        }

        const payload: CreateEvolutionEvent = {
            location: location,
            teamMemberId: teamMember.id,
            newPokedexNumber: newPokedexNumber,
            level: level
        }
        createEvolutionEvent(props.run.id, payload).then(
            success => {
                props.displaySnack("Evolution created successfully", "info")
                onClose()
            },
            error => {
                props.displaySnack(error.toString(), "error")
            }
        )
        console.log(payload)
    }

    const onClose = () => {
        setTeamMember(undefined)
        setLocation("")
        setLevel(5)
        setNewPokedexNumber(0)
        props.onClose()
    }

    const selectLocation = (text: string | null) => {
        if (text !== null) {
            setLocation(text)
        }
    }

    const selectPokemon = (target: TeamMember) => {
        setTeamMember(target)
        const availableEvos = evoMap.get(target.id)!!
        setAvailableEvolutions(availableEvos)
    }

    const setEvolutionTarget = (x: string | number) => {

    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Evolution</DialogTitle>
            <Autocomplete
                disablePortal
                options={alivePokemon}
                getOptionLabel={p => p.nickname}
                fullWidth
                disableClearable
                onChange={(_, selected) => selectPokemon(selected)}
                renderInput={(params) => <TextField {...params} label="Team Member"/>}
            />
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
            <Select fullWidth value={newPokedexNumber} onChange={x => setEvolutionTarget(x.target.value)}>
                {Array.from(availableEvolutions.keys()).map((x: number) => <MenuItem value={x} key={x}>
                    {props.pokedex.get(x)!!.name}
                </MenuItem>)}
            </Select>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}