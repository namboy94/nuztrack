import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useQuery} from "../../../../util/hooks/observable";
import {useState} from "react";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../../data/games/games.service";
import {teamService} from "../../../../data/team/team.service";
import {useResetState} from "../../../../util/hooks/state";
import {TeamMember} from "../../../../data/team/team.model";
import {ViewModel} from "../../../../util/viewmodel";
import {Pokedex} from "../../../../data/pokedex/pokedex.model";
import {useLevelInput} from "../../../common/hooks/levelInput.hook";

export interface TeamMemberEventState {
    open: boolean
    pokedex: Pokedex
    locations: string[]
    activeTeamMembers: TeamMember[]
    boxedTeamMembers: TeamMember[]
    location: string
    level: number | null
    teamMember: TeamMember | null
}

export interface TeamMemberEventInteractions {
    openDialog: () => void
    closeDialog: () => void
    onChangeLocation: (location: string) => void
    onChangeLevel: (level: number | null) => void
    onChangeTeamMember: (teamMember: TeamMember | null) => void
}


export type TeamMemberEventViewModel = ViewModel<TeamMemberEventState, TeamMemberEventInteractions>

export function useTeamMemberEventViewModel(
    run: NuzlockeRun,
    notify: NotificationFN,
    extraReset: () => void
): TeamMemberEventViewModel {
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const locations = useQuery(
        () => gamesService.getGameLocationRegistry$(run.game), undefined, []
    )?.getLocationNames() ?? []
    const activeTeamMembers = useQuery(() => teamService.getActiveTeamMembers$(run.id), [], [])
    const boxedTeamMembers = useQuery(() => teamService.getBoxedTeamMembers$(run.id), [], [])

    const [open, setOpen] = useState(false)
    const [location, setLocation, resetLocation] = useResetState("")
    const [teamMember, setTeamMember, resetTeamMember] = useResetState<TeamMember | null>(null)
    const [level, setLevel] = useLevelInput(5)

    const reset = () => {
        resetLocation()
        resetTeamMember()
        setLevel(5)
        extraReset()
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

    return {
        state: {
            open: open,
            pokedex: pokedex ?? Pokedex.EMPTY,
            locations: locations ?? [],
            activeTeamMembers: activeTeamMembers,
            boxedTeamMembers: boxedTeamMembers,
            location: location,
            level: level,
            teamMember: teamMember
        },
        interactions: {
            openDialog: openDialog,
            closeDialog: closeDialog,
            onChangeLevel: setLevel,
            onChangeLocation: setLocation,
            onChangeTeamMember: onChangeTeamMember,
        }
    }
}
