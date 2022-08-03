import {useState} from "react";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {runsService} from "../../../data/runs/runs.service";
import {NotificationFN} from "../../../global/Snackbar";
import {ViewModel} from "../../../util/viewmodel";

export interface DeleteRunDialogState {
    open: boolean,
    run: NuzlockeRun | undefined
}

export interface DeleteRunDialogInteractions {
    open: (run: NuzlockeRun) => void
    onClose: () => void
    submit: () => void
}

export type DeleteRunDialogViewModel = ViewModel<DeleteRunDialogState, DeleteRunDialogInteractions>

export function useDeleteRunDialogViewModel(notify: NotificationFN): DeleteRunDialogViewModel {

    const [open, setOpen] = useState(false)
    const [run, setRun] = useState<NuzlockeRun>()

    const openDialog = (run: NuzlockeRun) => {
        setRun(run)
        setOpen(true)
    }
    const onClose = () => {
        setOpen(false)
        setRun(undefined)
    }
    const submit = () => {
        if (run !== undefined) {
            runsService.deleteRun$(run.id).subscribe({
                complete: () => {
                    onClose()
                    notify(`Run ${run.name} has been deleted`, "info")
                }
            })
        }
    }

    return {
        state: {run: run, open: open},
        interactions: {open: openDialog, onClose: onClose, submit: submit}
    }
}
