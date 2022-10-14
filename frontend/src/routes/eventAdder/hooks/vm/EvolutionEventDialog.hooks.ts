import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useSubmitter} from "../../../../util/hooks/observable";
import {useResetState} from "../../../../util/hooks/state";
import {PokemonSpecies} from "../../../../data/pokedex/pokedex.model";
import {eventsService} from "../../../../data/events/events.service";
import {DialogInteractions, DialogState} from "../../../common/Dialog";
import {ViewModel} from "../../../../util/viewmodel";
import {TeamMemberEventInteractions, TeamMemberEventState, useTeamMemberEventViewModel} from "./TeamMemberEvent.vm";
import {TeamMember} from "../../../../data/team/team.model";

export interface EvolutionEventDialogState extends DialogState, TeamMemberEventState {
    evolutionTarget: PokemonSpecies | null
}

export interface EvolutionEventDialogInteractions extends DialogInteractions, TeamMemberEventInteractions {
    onChangeEvolutionTarget: (species: PokemonSpecies | null) => void
}

export type EvolutionEventDialogViewModel = ViewModel<EvolutionEventDialogState, EvolutionEventDialogInteractions>

export function useEvolutionEventDialogViewModel(
    run: NuzlockeRun, notify: NotificationFN
): EvolutionEventDialogViewModel {

    const [evolutionTarget, setEvolutionTarget, resetEvolutionTarget] = useResetState<PokemonSpecies | null>(null)

    const teamMemberSelectViewModel = useTeamMemberEventViewModel(run, notify, resetEvolutionTarget)
    const parentState = teamMemberSelectViewModel.state
    const parentInteractions = teamMemberSelectViewModel.interactions

    const onChangeTeamMember = (teamMember: TeamMember | null) => {
        parentInteractions.onChangeTeamMember(teamMember)
        resetEvolutionTarget()
    }

    const onSubmitSuccess = () => {
        parentInteractions.closeDialog()
        notify("Successfully created Evolution Event", "success")
    }

    const onSubmitError = (e: any) => notify(
        `Failed to create Evolution Event: '${e.response.data.reason}'`, "error"
    )

    const submit = useSubmitter(() => eventsService.createEvolutionEvent$(run.id, {
        level: parentState.level ?? -1,
        location: parentState.location,
        teamMemberId: parentState.teamMember?.id ?? -1,
        newPokedexNumber: evolutionTarget?.pokedexNumber ?? -1
    }), onSubmitSuccess, onSubmitError)

    return {
        state: {
            ...parentState,
            evolutionTarget
        },
        interactions: {
            ...parentInteractions,
            onChangeTeamMember: onChangeTeamMember,
            onChangeEvolutionTarget: setEvolutionTarget,
            submit: submit
        }
    }
}
