import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../components/Snackbar";
import {useState} from "react";
import {useQuery, useSubmitter} from "../../../util/observable.hooks";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {EvolutionEventDialogProps, EvolutionEventDialogState} from "../components/EvolutionEventDialog";
import {gamesService} from "../../../data/games/games.service";
import {teamService} from "../../../data/team/team.service";
import {useResetState} from "../../../util/state.hook";
import {TeamMember} from "../../../data/team/team.model";
import {PokemonSpecies} from "../../../data/pokedex/pokedex.model";
import {CreateEvolutionEvent} from "../../../data/events/events.model";
import {eventsService} from "../../../data/events/events.service";

export function useEvolutionEventDialogProps(
    run: NuzlockeRun, notify: NotificationFN
): [() => void, EvolutionEventDialogProps] {

    const [open, setOpen] = useState(false)
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const locations = locationRegistry?.getLocationNames() ?? []
    const activeTeamMembers = useQuery(() => teamService.getActiveTeamMembers$(run.id), [], [])
    const boxedTeamMembers = useQuery(() => teamService.getBoxedTeamMembers$(run.id), [], [])

    const state = useEvolutionEventDialogState()

    const onClose = () => {
        setOpen(false)
        state.reset()
    }

    const submit = useEvolutionEventSubmit(run, notify, state, onClose)

    const props: EvolutionEventDialogProps = {
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

function useEvolutionEventDialogState(): EvolutionEventDialogState {
    const [location, setLocation, resetLocation] = useResetState("")
    const [teamMember, setTeamMember, resetTeamMember] = useResetState<TeamMember | null>(null)
    const [level, setLevel, resetLevel] = useResetState(5)
    const [evolutionTarget, setEvolutionTarget, resetEvolutionTarget] = useResetState<PokemonSpecies | null>(null)

    const reset = () => {
        resetLocation()
        resetTeamMember()
        resetLevel()
        resetEvolutionTarget()
    }

    const selectTeamMember = (teamMember: TeamMember | null) => {
        setTeamMember(teamMember)
        setLevel(teamMember?.level ?? 5)
        resetEvolutionTarget()
    }

    return {
        teamMember: teamMember,
        evolutionTarget: evolutionTarget,
        level: level,
        location: location,
        reset: reset,
        setEvolutionTarget: setEvolutionTarget,
        setLevel: setLevel,
        setLocation: setLocation,
        setTeamMember: selectTeamMember
    }

}

function useEvolutionEventSubmit(
    run: NuzlockeRun,
    notify: NotificationFN,
    state: EvolutionEventDialogState,
    onClose: () => void
): () => void {

    const creator: CreateEvolutionEvent = {
        location: state.location,
        teamMemberId: state.teamMember?.id ?? -1,
        level: state.level,
        newPokedexNumber: state.evolutionTarget?.pokedexNumber ?? -1
    }

    const onSuccess = () => {
        notify("Successfully created Evolution", "success")
        onClose()
    }

    const onError = (e: any) => {
        notify(`Failed to create Evolution: '${e.response.data.reason}'`, "error")
    }

    return useSubmitter(() => eventsService.createEvolutionEvent$(run.id, creator), onSuccess, onError)
}
