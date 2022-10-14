import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useSubmitter} from "../../../../util/hooks/observable";
import {eventsService} from "../../../../data/events/events.service";
import {useResetState} from "../../../../util/hooks/state";
import {ViewModel} from "../../../../util/viewmodel";
import {DialogInteractions, DialogState} from "../../../common/Dialog";
import {TeamMemberEventInteractions, TeamMemberEventState, useTeamMemberEventViewModel} from "./TeamMemberEvent.vm";

export interface DeathEventDialogState extends DialogState, TeamMemberEventState {
    opponent: string
    description: string
}

export interface DeathEventDialogInteractions extends DialogInteractions, TeamMemberEventInteractions {
    onChangeOpponent: (opponent: string) => void
    onChangeDescription: (description: string) => void
}

export type DeathEventDialogViewModel = ViewModel<DeathEventDialogState, DeathEventDialogInteractions>

export function useDeathEventDialogViewModel(run: NuzlockeRun, notify: NotificationFN): DeathEventDialogViewModel {
    const [opponent, setOpponent, resetOpponent] = useResetState("")
    const [description, setDescription, resetDescription] = useResetState("")

    const reset = () => {
        resetOpponent()
        resetDescription()
    }

    const teamMemberSelectViewModel = useTeamMemberEventViewModel(run, notify, reset)
    const parentState = teamMemberSelectViewModel.state
    const parentInteractions = teamMemberSelectViewModel.interactions

    const onSubmitSuccess = () => {
        parentInteractions.closeDialog()
        notify("Successfully created Death Event", "success")
    }

    const onSubmitError = (e: any) => notify(`Failed to create Death Event: '${e.response.data.reason}'`, "error")

    const submit = useSubmitter(() => eventsService.createDeathEvent$(run.id, {
        description: description,
        level: parentState.level ?? -1,
        location: parentState.location,
        opponent: opponent,
        teamMemberId: parentState.teamMember?.id ?? -1
    }), onSubmitSuccess, onSubmitError)

    return {
        state: {
            ...parentState,
            opponent: opponent,
            description: description
        },
        interactions: {
            ...parentInteractions,
            onChangeDescription: setDescription,
            onChangeOpponent: setOpponent,
            submit: submit
        }
    }
}
