import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useQuery} from "../../../../util/hooks/observable";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {teamService} from "../../../../data/team/team.service";
import {TeamMember, TeamState} from "../../../../data/team/team.model";
import {ViewModel} from "../../../../util/viewmodel";
import {Pokedex} from "../../../../data/pokedex/pokedex.model";
import {SwitchType} from "../../../../data/events/events.model";
import {
    TeamMemberSwitchEventDialogViewModel,
    useTeamMemberSwitchEventDialogViewModel
} from "../../../eventAdder/hooks/vm/TeamMemberSwitchEventDialog.vm";
import {PokemonInfoViewModel, usePokemonInfoViewModel} from "./PokemonInfo.vm";

export interface PokemonGridState {
    run: NuzlockeRun,
    pokedex: Pokedex,
    teamMembers: TeamMember[],
    teamState: TeamState,
    teamMemberSwitchDialogVm: TeamMemberSwitchEventDialogViewModel,
    infoPageVm: PokemonInfoViewModel
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
    const pokemonInfoVm = usePokemonInfoViewModel()

    const openTeamMemberSwitchDialog = (teamMember: TeamMember) => {

        const validAdd = switchType === SwitchType.ADD && teamState === TeamState.BOXED
        const validRemove = switchType === SwitchType.REMOVE && teamState === TeamState.ACTIVE
        const valid = validAdd || validRemove

        if (valid) {
            teamMemberSwitchDialogVm.interactions.onChangeTeamMember(teamMember)
            teamMemberSwitchDialogVm.interactions.openDialog()
        } else {
            console.log("Invalid team member switch operation")
        }
    }

    const openInfoPage = (teamMember: TeamMember) => {
        pokemonInfoVm.interactions.openDialog(teamMember)
    }

    const closePopups = () => {
        teamMemberSwitchDialogVm.interactions.closeDialog()
        pokemonInfoVm.interactions.closeDialog()
    }

    return {
        state: {
            run: run,
            pokedex: pokedex ?? Pokedex.EMPTY,
            teamMembers: teamMembers,
            teamState: teamState,
            teamMemberSwitchDialogVm: teamMemberSwitchDialogVm,
            infoPageVm: pokemonInfoVm
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