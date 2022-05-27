import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";
import {useNavigate} from "react-router";
import ErrorSnackbar from "./ErrorSnackbar";

export interface CreateNewRunDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateNewRunDialog(props: CreateNewRunDialogProps) {
    const {open, onClose} = props
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [name, setName] = useState("")
    const [game, setGame] = useState("")

    const navigate = useNavigate()


    const createRun = () => {
        if (name === "" || game === "") {
            showError("The name and the game can not be empty")
            return
        }
        // TODO API CALL & Custom Error Message
        localStorage.setItem("runId", name + game)
        navigate("/run")
    }

    const showError = (message: string) => {
        setErrorOpen(true)
        setErrorMessage(message)
    }

    const handleClose = () => {
        setErrorOpen(false)
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Run</DialogTitle>
            <DialogContent>
                <TextField
                    onChange={(x) => setName(x.target.value)}
                    autoFocus margin="dense" fullWidth variant="standard"
                    id="name" label="Name" type="text" required

                />
                <TextField
                    onChange={(x) => setGame(x.target.value)}
                    autoFocus margin="dense" fullWidth variant="standard"
                    id="game" label="Game" type="text" required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createRun}>Create</Button>
            </DialogActions>
            <ErrorSnackbar open={errorOpen} setOpen={setErrorOpen} message={errorMessage}/>
        </Dialog>
    )
}