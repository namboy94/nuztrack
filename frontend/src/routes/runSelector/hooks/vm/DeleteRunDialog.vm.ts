import {useState} from "react";
import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {runsService} from "../../../../data/runs/runs.service";
import {NotificationFN} from "../../../../global/Snackbar";
import {ViewModel} from "../../../../util/viewmodel";
import {DialogInteractions, DialogState} from "../../../common/Dialog";

export interface DeleteRunDialogState extends DialogState {
    run: NuzlockeRun | null
}

export interface DeleteRunDialogInteractions extends Omit<DialogInteractions, "openDialog"> {
    openDialog: (run: NuzlockeRun) => void
}

export type DeleteRunDialogViewModel = ViewModel<DeleteRunDialogState, DeleteRunDialogInteractions>

export function useDeleteRunDialogViewModel(notify: NotificationFN): DeleteRunDialogViewModel {

    const [open, setOpen] = useState(false)
    const [run, setRun] = useState<NuzlockeRun | null>(null)

    const openDialog = (run: NuzlockeRun) => {
        setRun(run)
        setOpen(true)
    }
    const closeDialog = () => {
        setOpen(false)
        setRun(null)
    }
    const submit = () => {
        if (run !== null) {
            runsService.deleteRun$(run.id).subscribe({
                complete: () => {
                    closeDialog()
                    notify(`Run ${run.name} has been deleted`, "info")
                }
            })
        }
    }

    return {
        state: {run: run, open: open},
        interactions: {
            openDialog: openDialog,
            closeDialog: closeDialog,
            submit: submit
        }
    }
}
