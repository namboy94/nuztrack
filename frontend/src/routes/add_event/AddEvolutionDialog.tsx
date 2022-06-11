import {Autocomplete, Button, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {GameLocation} from "../../api/games/gamesTypes";
import {Team, TeamMember} from "../../api/team_member/teamMemberTypes";
import {CreateEvolutionEvent} from "../../api/events/evolution/evolutionEventTypes";
import {createEvolutionEvent} from "../../api/events/evolution/evolutionEventApi";
import {Pokedex, PokemonSpecies} from "../../api/pokedex/pokedexTypes";

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

    const [teamMember, setTeamMember] = useState<TeamMember>()
    const [location, setLocation] = useState("")
    const [level, setLevel] = useState(5)
    const [evolutionTarget, setEvolutionTarget] = useState<PokemonSpecies>()
    const [availableEvolutions, setAvailableEvolutions] = useState<PokemonSpecies[]>([])

    const submit = () => {

        if (teamMember === undefined || evolutionTarget === undefined) {
            return
        }

        const payload: CreateEvolutionEvent = {
            location: location,
            teamMemberId: teamMember.id,
            newPokedexNumber: evolutionTarget.pokedexNumber,
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
        setEvolutionTarget(undefined)
        props.onClose()
    }

    const selectLocation = (text: string | null) => {
        if (text !== null) {
            setLocation(text)
        }
    }

    const selectPokemon = (target: TeamMember) => {
        setTeamMember(target)
        const availableEvos = props.pokedex.get(target.pokedexNumber)!!.evolutions
        setAvailableEvolutions(availableEvos.map(x => props.pokedex.get(x)!!))
        setEvolutionTarget(undefined)
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Evolution</DialogTitle>
            <Autocomplete
                value={teamMember}
                options={alivePokemon}
                getOptionLabel={p => p.nickname}
                fullWidth
                disableClearable
                onChange={(_, selected) => selectPokemon(selected)}
                renderInput={(params) => <TextField {...params} value={teamMember?.nickname} label="Team Member"/>}
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
            <Autocomplete
                value={evolutionTarget}
                options={availableEvolutions}
                getOptionLabel={p => p.name}
                fullWidth
                disableClearable
                onChange={(_, selected) => setEvolutionTarget(selected)}
                renderInput={(params) => <TextField {...params} label="Evolution Target"/>}
            />
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}