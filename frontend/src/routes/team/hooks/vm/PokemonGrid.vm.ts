import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useQuery} from "../../../../util/hooks/observable";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {teamService} from "../../../../data/team/team.service";
import {TeamMember, TeamState} from "../../../../data/team/team.model";
import {ViewModel} from "../../../../util/viewmodel";
import {Pokedex} from "../../../../data/pokedex/pokedex.model";
import {useResetState} from "../../../../util/hooks/state";
import {useState} from "react";
import {SwitchType} from "../../../../data/events/events.model";
import {
    TeamMemberSwitchEventDialogViewModel,
    useTeamMemberSwitchEventDialogViewModel
} from "../../../eventAdder/hooks/vm/TeamMemberSwitchEventDialog.vm";

export interface PokemonGridState {
    run: NuzlockeRun,
    pokedex: Pokedex,
    teamMembers: TeamMember[],
    teamState: TeamState,
    selectedTeamMember: TeamMember | null,
    infoPageOpen: boolean,
    teamMemberSwitchDialogVm: TeamMemberSwitchEventDialogViewModel,
}

export interface PokemonGridInteractions {
    notify: NotificationFN,
    openTeamMemberSwitchDialog: (teamMember: TeamMember) => void,
    openInfoPage: (teamMember: TeamMember) => void,
    closePopups: () => void,
}

export type PokemonGridViewModel = ViewModel<PokemonGridState, PokemonGridInteractions>

export function usePokemonGridViewModel(
    run: NuzlockeRun, notify: NotificationFN, teamState: TeamState
): PokemonGridViewModel {
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const teamMembers = useQuery(
        () => teamService.getTeamMembersByState$(run.id, teamState), [], []
    )

    const switchType = calculateTeamMemberSwitchType(teamState)
    const teamMemberSwitchDialogVm = useTeamMemberSwitchEventDialogViewModel(run, notify, switchType ?? SwitchType.REMOVE)

    const [selectedTeamMember, setSelectedTeamMember, resetSelectedTeamMember] = useResetState<TeamMember | null>(null)
    const [infoPageOpen, setInfoPageOpen] = useState(false)

    const openTeamMemberSwitchDialog = (teamMember: TeamMember) => {

        const validAdd = switchType === SwitchType.ADD && teamState === TeamState.BOXED
        const validRemove = switchType === SwitchType.REMOVE && teamState === TeamState.ACTIVE
        const valid = validAdd || validRemove

        if (valid) {
            setSelectedTeamMember(teamMember)
            teamMemberSwitchDialogVm.interactions.onChangeTeamMember(teamMember)
            teamMemberSwitchDialogVm.interactions.openDialog()
        } else {
            resetSelectedTeamMember()
            console.log("Invalid team member switch operation")
        }
    }

    const openInfoPage = (teamMember: TeamMember) => {
        setSelectedTeamMember(teamMember)
        setInfoPageOpen(true)
    }

    const closePopups = () => {
        resetSelectedTeamMember()
        setInfoPageOpen(false)
        teamMemberSwitchDialogVm.interactions.closeDialog()
    }


    return {
        state: {
            run: run,
            pokedex: pokedex ?? Pokedex.EMPTY,
            teamMembers: teamMembers,
            teamState: teamState,
            selectedTeamMember: selectedTeamMember,
            infoPageOpen: infoPageOpen,
            teamMemberSwitchDialogVm: teamMemberSwitchDialogVm,
        },
        interactions: {
            notify: notify,
            openInfoPage: openInfoPage,
            openTeamMemberSwitchDialog: openTeamMemberSwitchDialog,
            closePopups: closePopups
        }
    }
}

function calculateTeamMemberSwitchType(teamState: TeamState): SwitchType | null {
    switch (teamState) {
        case TeamState.ACTIVE:
            return SwitchType.REMOVE
        case TeamState.BOXED:
            return SwitchType.ADD
        default:
            return null
    }
}