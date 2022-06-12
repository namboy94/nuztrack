import {ReactElement, useState} from "react";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {DeleteRunDialog} from "../components/deleteRun.dialog";

export function useDeleteRunDialog(): [ReactElement, (run: NuzlockeRun) => void] {
    const [open, setOpen] = useState(false)
    const [run, setRun] = useState<NuzlockeRun | null>(null)

    const showDeleteDialog = (run: NuzlockeRun) => {
        setRun(run)
        setOpen(true)
    }
    const closeDeleteDialog = () => {
        setOpen(false)
        setRun(null)
    }

    const dialog = DeleteRunDialog({
        open: open,
        run: run,
        onClose: closeDeleteDialog
    })

    return [dialog, showDeleteDialog]

}