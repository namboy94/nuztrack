import {Alert, Snackbar} from "@mui/material";
import React from "react";


type ErrorSnackbarProps = {
    open: boolean,
    setOpen: (state: boolean) => void
    message: string
}

export default function ErrorSnackbar(props: ErrorSnackbarProps) {
    const {open, setOpen, message} = props

    return (
        <Snackbar open={open} autoHideDuration={6000}>
            <Alert onClose={() => setOpen(false)} severity={"error"} sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    )
}