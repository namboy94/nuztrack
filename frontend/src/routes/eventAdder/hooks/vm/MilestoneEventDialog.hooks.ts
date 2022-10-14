import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useState} from "react";
import {useQuery, useSubmitter} from "../../../../util/hooks/observable";
import {gamesService} from "../../../../data/games/games.service";
import {useResetState} from "../../../../util/hooks/state";
import {Milestone} from "../../../../data/games/games.model";
import {eventsService} from "../../../../data/events/events.service";
import {DialogInteractions, DialogState} from "../../../common/Dialog";
import {ViewModel} from "../../../../util/viewmodel";

export interface MilestoneEventDialogState extends DialogState {
    milestone: Milestone | null,
    milestones: Milestone[]
}

export interface MilestoneEventDialogInteractions extends DialogInteractions {
    onChangeMilestone: (milestone: Milestone | null) => void
}

export type MilestoneEventDialogViewModel = ViewModel<MilestoneEventDialogState, MilestoneEventDialogInteractions>

export function useMilestoneEventDialogViewModel(
    run: NuzlockeRun,
    notify: NotificationFN
): MilestoneEventDialogViewModel {

    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const milestones = locationRegistry?.getMilestones() ?? []

    const [open, setOpen] = useState(false)
    const [milestone, setMilestone, resetMilestone] = useResetState<Milestone | null>(null)

    const closeDialog = () => {
        setOpen(false)
        resetMilestone()
    }

    const onSuccess = () => {
        notify("Successfully added a Milestone", "success")
        closeDialog()
    }

    const onError = (e: any) => {
        notify(`Failed to add Milestone: '${e.response.data.reason}'`, "error")
    }

    const submit = useSubmitter(() => eventsService.createMilestoneEvent$(run.id, {
        location: milestone?.location ?? "",
        milestone: milestone?.name ?? ""
    }), onSuccess, onError)

    return {
        state: {
            open: open,
            milestone: milestone,
            milestones: milestones
        },
        interactions: {
            closeDialog: closeDialog,
            openDialog: () => setOpen(true),
            onChangeMilestone: setMilestone,
            submit: submit
        }
    }
}
