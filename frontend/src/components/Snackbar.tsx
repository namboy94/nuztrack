import {Alert, Snackbar as MuiSnackbar} from "@mui/material";
import React from "react";


export type Severity = "warning" | "error" | "info" | "success"
export type NotificationFN = (message: string, severity: Severity) => void

interface SnackbarProps {
    open: boolean,
    setOpen: (state: boolean) => void
    message: string,
    severity: Severity
}

export default function Snackbar(props: SnackbarProps) {
    const {open, setOpen, message, severity} = props

    return (
        <MuiSnackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
            <Alert onClose={() => setOpen(false)} color={severity} severity={severity} sx={{width: '100%'}}>
                {message}
            </Alert>
        </MuiSnackbar>
    )
}