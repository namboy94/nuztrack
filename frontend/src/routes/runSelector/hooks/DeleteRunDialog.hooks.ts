import {useState} from "react";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {DeleteRunDialogProps} from "../components/DeleteRunDialog";
import {runsService} from "../../../data/runs/runs.service";
import {NotificationFN} from "../../../global/Snackbar";

export function useDeleteRunDialogProps(notify: NotificationFN): [(run: NuzlockeRun) => void, DeleteRunDialogProps] {
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
    const deleteRun = () => {
        if (run !== null) {
            runsService.deleteRun$(run.id).subscribe({
                complete: () => {
                    closeDialog()
                    notify(`Run ${run.name} has been deleted`, "info")
                }
            })
        }
    }

    const props = {
        open: open,
        run: run,
        onClose: closeDialog,
        deleteRun: deleteRun
    }

    return [openDialog, props]

}