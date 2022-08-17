export interface DialogState {
    open: boolean
}

export interface DialogInteractions {
    openDialog: () => void
    closeDialog: () => void
    submit: () => void
}
