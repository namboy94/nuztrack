import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../global/Snackbar";
import {MilestoneEventDialogProps, MilestoneEventDialogState} from "../components/MilestoneEventDialog";
import {useState} from "react";
import {useQuery, useSubmitter} from "../../../util/hooks/observable";
import {gamesService} from "../../../data/games/games.service";
import {useResetState} from "../../../util/hooks/state";
import {Milestone} from "../../../data/games/games.model";
import {CreateMilestoneEvent} from "../../../data/events/events.model";
import {eventsService} from "../../../data/events/events.service";

export function useMilestoneEventDialogProps(
    run: NuzlockeRun,
    notify: NotificationFN
): [() => void, MilestoneEventDialogProps] {

    const [open, setOpen] = useState(false)
    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const milestones = locationRegistry?.getMilestones() ?? []
    const state = useMilestoneEventDialogState()

    const onClose = () => {
        setOpen(false)
        state.reset()
    }

    const submit = useMilestoneEventSubmit(run, notify, onClose, state)

    const props: MilestoneEventDialogProps = {
        milestones: milestones,
        onClose: onClose,
        open: open,
        state: state,
        submit: submit
    }

    return [() => setOpen(true), props]
}

function useMilestoneEventDialogState(): MilestoneEventDialogState {
    const [milestone, setMilestone, resetMilestone] = useResetState<Milestone | null>(null)
    return {
        milestone: milestone,
        setMilestone: setMilestone,
        reset: resetMilestone
    }
}

function useMilestoneEventSubmit(
    run: NuzlockeRun,
    notify: NotificationFN,
    onClose: () => void,
    state: MilestoneEventDialogState
): () => void {
    const creator: CreateMilestoneEvent = {
        location: state.milestone?.location ?? "",
        milestone: state.milestone?.name ?? ""
    }

    const onSuccess = () => {
        notify("Successfully added a Milestone", "success")
        onClose()
    }

    const onError = (e: any) => {
        notify(`Failed to add Milestone: '${e.response.data.reason}'`, "error")
    }

    return useSubmitter(() => eventsService.createMilestoneEvent$(run.id, creator), onSuccess, onError)
}