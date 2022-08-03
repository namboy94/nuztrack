import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../global/Snackbar";
import {
    TeamMemberSwitchEventDialogProps,
    TeamMemberSwitchEventDialogState
} from "../components/TeamMemberSwitchEventDialog";
import {useState} from "react";
import {CreateTeamMemberSwitchEvent, SwitchType} from "../../../data/events/events.model";
import {useQuery, useSubmitter} from "../../../util/hooks/observable";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";
import {teamService} from "../../../data/team/team.service";
import {useResetState} from "../../../util/hooks/state";
import {TeamMember} from "../../../data/team/team.model";
import {eventsService} from "../../../data/events/events.service";

export function useTeamMemberSwitchEventDialogProps(
    run: NuzlockeRun,
    notify: NotificationFN,
    mode: SwitchType
): [() => void, TeamMemberSwitchEventDialogProps] {

    const [open, setOpen] = useState(false)

    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const locations = locationRegistry?.getLocationNames() ?? []
    const activeTeamMembers = useQuery(() => teamService.getActiveTeamMembers$(run.id), [], [])
    const boxedTeamMembers = useQuery(() => teamService.getBoxedTeamMembers$(run.id), [], [])

    const state = useTeamMemberSwitchEventDialogState()

    const onClose = () => {
        setOpen(false)
        state.reset()
    }

    const submit = useTeamMemberSwitchEventSubmit(run, notify, onClose, mode, state)

    const props: TeamMemberSwitchEventDialogProps = {
        activeTeamMembers: activeTeamMembers,
        boxedTeamMembers: boxedTeamMembers,
        locations: locations,
        pokedex: pokedex,
        mode: mode,
        state: state,
        submit: submit,
        onClose: onClose,
        open: open
    }

    return [() => setOpen(true), props]

}

function useTeamMemberSwitchEventDialogState(): TeamMemberSwitchEventDialogState {
    const [location, setLocation, resetLocation] = useResetState("")
    const [teamMember, setTeamMember, resetTeamMember] = useResetState<TeamMember | null>(null)

    const reset = () => {
        resetLocation()
        resetTeamMember()
    }

    return {
        location: location,
        setLocation: setLocation,
        teamMember: teamMember,
        setTeamMember: setTeamMember,
        reset: reset
    }
}

function useTeamMemberSwitchEventSubmit(
    run: NuzlockeRun,
    notify: NotificationFN,
    onClose: () => void,
    mode: SwitchType,
    state: TeamMemberSwitchEventDialogState
): () => void {
    const creator: CreateTeamMemberSwitchEvent = {
        location: state.location,
        switchType: mode,
        teamMemberId: state.teamMember?.id ?? -1
    }

    const onSuccess = () => {
        const verb = mode == SwitchType.ADD ? "added" : "removed"
        notify(`Successfully ${verb} team member`, "success")
        onClose()
    }

    const onError = (e: any) => {
        const verb = mode == SwitchType.ADD ? "add" : "remove"
        notify(`Failed to ${verb} team member: '${e.response.data.reason}'`, "error")
    }

    return useSubmitter(() => eventsService.createTeamMemberSwitchEvent$(run.id, creator), onSuccess, onError)
}