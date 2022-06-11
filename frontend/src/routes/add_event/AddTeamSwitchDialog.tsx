import {Autocomplete, Button, Dialog, DialogActions, DialogTitle, MenuItem, Select, TextField} from "@mui/material";
import React, {useState} from "react";
import {Severity} from "../../components/Snackbar";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {GameLocation} from "../../api/games/gamesTypes";
import {Team, TeamMember} from "../../api/team_member/teamMemberTypes";
import {CreateTeamMemberSwitchEvent} from "../../api/events/team_member_switch/teamMemberSwitchEventTypes";
import {createTeamMemberSwitchEvent} from "../../api/events/team_member_switch/teamMemberSwitchEventApi";

interface AddTeamSwitchDialogProps {
    open: boolean
    onClose: () => void
    displaySnack: (message: string, severity: Severity) => void
    run: NuzlockeRun
    locations: GameLocation[]
    team: Team
}

export default function AddTeamSwitchDialog(props: AddTeamSwitchDialogProps) {

    const alivePokemon = props.team.active.concat(props.team.boxed)

    const [teamMember, setTeamMember] = useState<TeamMember>()
    const [mode, setMode] = useState<"ADD" | "REMOVE">("ADD")
    const [location, setLocation] = useState("")

    const submit = () => {
        if (teamMember === undefined) {
            return
        }

        const payload: CreateTeamMemberSwitchEvent = {
            location: location,
            teamMemberId: teamMember.id,
            switchType: mode
        }
        createTeamMemberSwitchEvent(props.run.id, payload).then(
            success => {
                props.displaySnack("Switched Successfully", "info")
                onClose()
            },
            error => {
                props.displaySnack(error.toString(), "error")
            }
        )
        console.log(payload)
    }

    const selectLocation = (text: string | null) => {
        if (text !== null) {
            setLocation(text)
        }
    }

    const onClose = () => {
        setTeamMember(undefined)
        setMode("ADD")
        setLocation("")
        props.onClose()
    }

    const setSwitchMode = (newMode: string) => {
        if (newMode === "ADD" || newMode === "REMOVE") {
            setMode(newMode)
        }
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Add Team Member Switch</DialogTitle>
            <Autocomplete
                value={teamMember}
                options={alivePokemon}
                getOptionLabel={p => p.nickname}
                fullWidth
                disableClearable
                onChange={(_, selected) => setTeamMember(selected)}
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
            <Select fullWidth value={mode} onChange={x => setSwitchMode(x.target.value)}>
                <MenuItem value={"ADD"}>Add</MenuItem>
                <MenuItem value={"REMOVE"}>Remove</MenuItem>
            </Select>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}