import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useQuery, useSubmitter} from "../../../../util/hooks/observable";
import {eventsService} from "../../../../data/events/events.service";
import {useState} from "react";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../../data/games/games.service";
import {teamService} from "../../../../data/team/team.service";
import {useResetState} from "../../../../util/hooks/state";
import {TeamMember} from "../../../../data/team/team.model";
import {ViewModel} from "../../../../util/viewmodel";
import {Pokedex, PokemonSpecies} from "../../../../data/pokedex/pokedex.model";
import {DialogInteractions, DialogState} from "../../../common/Dialog";

export interface DeathEventDialogState extends DialogState {
    pokedex: Pokedex
    locations: string[]
    activeTeamMembers: TeamMember[]
    boxedTeamMembers: TeamMember[]
    location: string
    level: number | null
    teamMember: TeamMember | null
    opponent: string
    description: string
}

export interface DeathEventDialogInteractions extends DialogInteractions {
    onChangeLocation: (location: string) => void
    onChangeLevel: (level: number | null) => void
    onChangeTeamMember: (teamMember: TeamMember | null) => void
    onChangeOpponent: (opponent: string) => void
    onChangeDescription: (description: string) => void
}


export type DeathEventDialogViewModel = ViewModel<DeathEventDialogState, DeathEventDialogInteractions>

export function useDeathEventDialogViewModel(run: NuzlockeRun, notify: NotificationFN): DeathEventDialogViewModel {
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const locations = useQuery(
        () => gamesService.getGameLocationRegistry$(run.game), undefined, []
    )?.getLocationNames() ?? []
    const activeTeamMembers = useQuery(() => teamService.getActiveTeamMembers$(run.id), [], [])
    const boxedTeamMembers = useQuery(() => teamService.getBoxedTeamMembers$(run.id), [], [])

    const [open, setOpen] = useState(false)
    const [location, setLocation, resetLocation] = useResetState("")
    const [teamMember, setTeamMember, resetTeamMember] = useResetState<TeamMember | null>(null)
    const [level, setLevel, resetLevel] = useResetState<number | null>(5)
    const [opponent, setOpponent, resetOpponent] = useResetState("")
    const [description, setDescription, resetDescription] = useResetState("")

    const reset = () => {
        resetLocation()
        resetTeamMember()
        resetLevel()
        resetOpponent()
        resetDescription()
    }

    const onChangeTeamMember = (teamMember: TeamMember | null) => {
        setTeamMember(teamMember)
        setLevel(teamMember?.level ?? 5)
    }

    const openDialog = () => setOpen(true)

    const closeDialog = () => {
        setOpen(false)
        reset()
    }

    const onSubmitSuccess = () => {
        closeDialog()
        notify("Successfully created Death Event", "success")
    }

    const onSubmitError = (e: any) => notify(`Failed to create Death Event: '${e.response.data.reason}'`, "error")

    const submit = useSubmitter(() => eventsService.createDeathEvent$(run.id, {
        description: description,
        level: level ?? -1,
        location: location,
        opponent: opponent,
        teamMemberId: teamMember?.id ?? -1
    }), onSubmitSuccess, onSubmitError)

    return {
        state: {
            open: open,
            pokedex: pokedex ?? new Pokedex(new Map<number, PokemonSpecies>()),
            locations: locations ?? [],
            activeTeamMembers: activeTeamMembers,
            boxedTeamMembers: boxedTeamMembers,
            location: location,
            level: level,
            teamMember: teamMember,
            opponent: opponent,
            description: description
        },
        interactions: {
            openDialog: openDialog,
            closeDialog: closeDialog,
            onChangeDescription: setDescription,
            onChangeLevel: setLevel,
            onChangeLocation: setLocation,
            onChangeOpponent: setOpponent,
            onChangeTeamMember: onChangeTeamMember,
            submit: submit
        }
    }
}
