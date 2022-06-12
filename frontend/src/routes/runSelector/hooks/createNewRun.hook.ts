import {ReactElement, useState} from "react";
import {CreateNewRunDialog} from "../components/createNewRun.dialog";

export function useCreateNewRunDialog(): [ReactElement, () => void] {
    const [open, setOpen] = useState(false)

    const showCreateDialog = () => {
        setOpen(true)
    }
    const closeCreateDialog = () => {
        setOpen(false)
    }

    const dialog = CreateNewRunDialog({
        open: open,
        onClose: closeCreateDialog
    })

    return [dialog, showCreateDialog]
}