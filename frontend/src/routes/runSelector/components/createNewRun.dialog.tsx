import {
    Autocomplete,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    TextField
} from "@mui/material";
import React, {useState} from "react";

export interface CreateNewRunDialogProps {
    open: boolean,
    onClose: () => void
}

export function CreateNewRunDialog(props: CreateNewRunDialogProps) {

    const {open, onClose} = props

    const gamesOptions = ["A", "B", "C"]
    const rulesOptions = ["A", "B", "C"]
    const defaultRules = ["A", "B"]

    const [game, setGame] = useState(gamesOptions[0])
    const [name, setName] = useState("")
    const [rules, setRules] = useState<string[]>(defaultRules)
    const [customRules, setCustomRules] = useState<string[]>([])

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Run</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField
                            autoFocus
                            margin="dense"
                            variant="outlined"
                            type="text"
                            required
                            label="Name"
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            sx={{width: 200}}
                            options={gamesOptions}
                            value={game}
                            disableClearable
                            onChange={(_, game) => setGame(game)}
                            renderInput={(params) =>
                                <TextField label="Game" margin="dense" variant={"outlined"} {...params}/>}
                        />
                    </Grid>
                </Grid>
                <h3>Rules</h3>
                <FormGroup>
                    {rulesOptions.map(key =>
                        <FormControlLabel key={key} control={
                            <Checkbox
                                name={key}
                                onChange={x => console.log(key, x.target.checked)}/>
                        } label={key}/>
                    )}
                </FormGroup>
                <TextField
                    onChange={(x) => console.log(x.target.value.split("\n"))}
                    autoFocus margin="dense" fullWidth variant="standard" multiline
                    id="custom-rules" type="text" label="Custom Rules"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => console.log(1)}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}