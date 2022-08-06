import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../global/Snackbar";
import {useQuery, useSubmitter} from "../../../util/hooks/observable";
import {eventsService} from "../../../data/events/events.service";
import {useState} from "react";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";
import {teamService} from "../../../data/team/team.service";
import {useResetState} from "../../../util/hooks/state";
import {TeamMember} from "../../../data/team/team.model";
import {ViewModel} from "../../../util/viewmodel";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {GameLocation} from "../../../data/games/games.model";

export interface DeathEventDialogState {
    open: boolean
    pokedex: Pokedex
    locations: GameLocation[]
    activeTeamMembers: TeamMember[]
    boxedTeamMembers: TeamMember[]
    location: string
    level: number
    teamMember: TeamMember | null
    opponent: string
    description: string
}

export interface DeathEventDialogInteractions {
    openDialog: () => void
    onClose: () => void
    onChangeLocation: (location: string) => void
    onChangeLevel: (level: number) => void
    onChangeTeamMember: (teamMember: TeamMember | null) => void
    onChangeOpponent: (opponent: string) => void
    onChangeDescription: (description: string) => void
    submit: () => void
}


export type DeathEventDialogViewModel = ViewModel<DeathEventDialogState, DeathEventDialogInteractions>

export function useDeathEventDialogProps(run: NuzlockeRun, notify: NotificationFN): DeathEventDialogViewModel {
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const locations = useQuery(
        () => gamesService.getGameLocationRegistry$(run.game), undefined, []
    )?.getLocationNames() ?? []
    const activeTeamMembers = useQuery(() => teamService.getActiveTeamMembers$(run.id), [], [])
    const boxedTeamMembers = useQuery(() => teamService.getBoxedTeamMembers$(run.id), [], [])

    const [open, setOpen] = useState(false)
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

    const onChangeTeamMember = (teamMember: TeamMember | null) => {
        setTeamMember(teamMember)
        setLevel(teamMember?.level ?? 5)
    }

    const openDialog = () => setOpen(true)

    const onClose = () => {
        setOpen(false)
        reset()
    }

    const onSubmitSuccess = () => {
        onClose()
        notify("Successfully created Death Event", "success")
    }

    const onSubmitError = (e: any) => notify(`Failed to create Death Event: '${e.response.data.reason}'`, "error")

    const submit = useSubmitter(() => eventsService.createDeathEvent$(run.id, {
        description: description,
        level: level,
        location: location,
        opponent: opponent,
        teamMemberId: teamMember?.id ?? -1
    }), onSubmitSuccess, onSubmitError)

    return {
        state: {
            open: open,
            pokedex: pokedex,
            locations: locations,
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
            onClose: onClose,
            onChangeDescription: setDescription,
            onChangeLevel: setLevel,
            onChangeLocation: setLocation,
            onChangeOpponent: setOpponent,
            onChangeTeamMember: onChangeTeamMember,
            submit: submit
        }
    }
}
