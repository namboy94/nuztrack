import {useState} from "react";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {DeleteRunDialogProps} from "../components/DeleteRunDialog";

export function useDeleteRunDialogProps(): [(run: NuzlockeRun) => void, DeleteRunDialogProps] {
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

    const props = {
        open: open,
        run: run,
        onClose: closeDialog
    }

    return [openDialog, props]

}