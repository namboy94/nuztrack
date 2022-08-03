import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../global/Snackbar";
import {DeathEventDialogProps, DeathEventDialogState} from "../components/DeathEventDialog";
import {CreateDeathEvent} from "../../../data/events/events.model";
import {useQuery, useSubmitter} from "../../../util/hooks/observable";
import {eventsService} from "../../../data/events/events.service";
import {useState} from "react";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";
import {teamService} from "../../../data/team/team.service";
import {useResetState} from "../../../util/hooks/state";
import {TeamMember} from "../../../data/team/team.model";

export function useDeathEventDialogProps(
    run: NuzlockeRun,
    notify: NotificationFN
): [() => void, DeathEventDialogProps] {

    const [open, setOpen] = useState(false)
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const locations = locationRegistry?.getLocationNames() ?? []
    const activeTeamMembers = useQuery(() => teamService.getActiveTeamMembers$(run.id), [], [])
    const boxedTeamMembers = useQuery(() => teamService.getBoxedTeamMembers$(run.id), [], [])

    const state = useDeathEventDialogState()

    const onClose = () => {
        setOpen(false)
        state.reset()
    }

    const submit = useDeathEventSubmit(run, notify, onClose, state)

    const props: DeathEventDialogProps = {
        activeTeamMembers: activeTeamMembers,
        boxedTeamMembers: boxedTeamMembers,
        locations: locations,
        onClose: onClose,
        open: open,
        pokedex: pokedex,
        state: state,
        submit: submit
    }
    return [() => setOpen(true), props]

}

function useDeathEventDialogState(): DeathEventDialogState {
    const [location, setLocation, resetLocation] = useResetState("")
    const [teamMember, setTeamMember, resetTeamMember] = useResetState<TeamMember | null>(null)
    const [level, setLevel, resetLevel] = useResetState(5)
    const [opponent, setOpponent, resetOpponent] = useResetState("")
    const [description, setDescription, resetDescription] = useResetState("")

    const reset = () => {
        resetLocation()
        resetTeamMember()
        resetLevel()
        resetOpponent()
        resetDescription()
    }

    const selectTeamMember = (teamMember: TeamMember | null) => {
        setTeamMember(teamMember)
        setLevel(teamMember?.level ?? 5)
    }

    return {
        teamMember: teamMember,
        level: level,
        location: location,
        description: description,
        opponent: opponent,
        reset: reset,
        setLevel: setLevel,
        setLocation: setLocation,
        setTeamMember: selectTeamMember,
        setDescription: setDescription,
        setOpponent: setOpponent
    }

}

function useDeathEventSubmit(
    run: NuzlockeRun,
    notify: NotificationFN,
    onClose: () => void,
    state: DeathEventDialogState
): () => void {
    const creator: CreateDeathEvent = {
        description: state.description,
        level: state.level,
        location: state.location,
        opponent: state.opponent,
        teamMemberId: state.teamMember?.id ?? -1
    }

    const onSuccess = () => {
        onClose()
        notify("Successfully created Death Event", "success")
    }

    const onError = (e: any) => {
        notify(`Failed to create Death Event: '${e.response.data.reason}'`, "error")
    }

    return useSubmitter(() => eventsService.createDeathEvent$(run.id, creator), onSuccess, onError)

}