import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {SwitchType} from "../../../../data/events/events.model";
import {useSubmitter} from "../../../../util/hooks/observable";
import {eventsService} from "../../../../data/events/events.service";
import {DialogInteractions, DialogState} from "../../../common/Dialog";
import {TeamMemberEventInteractions, TeamMemberEventState, useTeamMemberEventViewModel} from "./TeamMemberEvent.vm";
import {ViewModel} from "../../../../util/viewmodel";

export interface TeamMemberSwitchEventDialogState
    extends DialogState, Omit<TeamMemberEventState, "level"> {
    mode: SwitchType
}

export interface TeamMemberSwitchEventDialogInteractions
    extends DialogInteractions, Omit<TeamMemberEventInteractions, "onChangeLevel"> {
}

export type TeamMemberSwitchEventDialogViewModel =
    ViewModel<TeamMemberSwitchEventDialogState, TeamMemberSwitchEventDialogInteractions>

export function useTeamMemberSwitchEventDialogViewModel(
    run: NuzlockeRun,
    notify: NotificationFN,
    mode: SwitchType
): TeamMemberSwitchEventDialogViewModel {

    const teamMemberSelectViewModel = useTeamMemberEventViewModel(run, notify, () => {
    })
    const parentState = teamMemberSelectViewModel.state
    const parentInteractions = teamMemberSelectViewModel.interactions

    const onSubmitSuccess = () => {
        parentInteractions.closeDialog()
        const verb = mode === SwitchType.ADD ? "added" : "removed"
        notify(`Successfully ${verb} team member`, "success")
    }

    const onSubmitError = (e: any) => {
        const verb = mode === SwitchType.ADD ? "add" : "remove"
        notify(`Failed to ${verb} team member: '${e.response.data.reason}'`, "error")
    }

    const submit = useSubmitter(() => eventsService.createTeamMemberSwitchEvent$(run.id, {
        location: parentState.location,
        teamMemberId: parentState.teamMember?.id ?? -1,
        switchType: mode
    }), onSubmitSuccess, onSubmitError)


    return {
        state: {
            ...parentState,
            mode: mode
        },
        interactions: {
            ...parentInteractions,
            submit: submit
        }
    }
}
