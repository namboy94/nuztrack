import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router";

export interface CreateNewRunDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateNewRunDialog(props: CreateNewRunDialogProps) {
    const {open, onClose} = props

    const [name, setName] = useState("")
    const [game, setGame] = useState("")

    const navigate = useNavigate()

    const createRun = () => {
        // API CALL
        localStorage.setItem("runId", name+game)
        navigate("/run")
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Run</DialogTitle>
            <DialogContent>
                <TextField
                    onChange={(x) => setName(x.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    onChange={(x) => setGame(x.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Game"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={createRun}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}