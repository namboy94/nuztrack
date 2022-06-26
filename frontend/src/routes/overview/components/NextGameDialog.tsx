import {Game} from "../../../data/games/games.model";
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
import React from "react";
import {MultiRunOption} from "../../../data/runs/runs.model";

export interface NextGameDialogProps {
    open: boolean
    onClose: () => void
    submit: () => void
    state: NextGameDialogState
    games: Game[]
    options: MultiRunOption[]
}

export interface NextGameDialogState {
    newName: string
    setNewName: (name: string) => void
    newGame: Game
    setNewGame: (game: Game) => void
    options: string[]
    setOptions: (options: string[]) => void
    reset: () => void
}

export function NextGameDialog(props: NextGameDialogProps) {
    const {open, onClose, submit, state, games, options} = props

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Next Game in Multi-Run Nuzlocke</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField
                            data-testid="name-input"
                            autoFocus
                            margin="dense"
                            variant="outlined"
                            type="text"
                            required
                            label="Run Name"
                            value={state.newName}
                            onChange={x => state.setNewName(x.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            data-testid="game-input"
                            sx={{width: 200}}
                            options={games}
                            value={state.newGame}
                            disableClearable
                            getOptionLabel={game => game.title}
                            onChange={(_, newGame) => state.setNewGame(newGame)}
                            renderInput={(params) =>
                                <TextField label="Game" margin="dense" variant={"outlined"} {...params}/>}
                        />
                    </Grid>
                </Grid>
                <h3>Rules</h3>
                <FormGroup>
                    {options.map(option =>
                        <FormControlLabel label={option.key} key={option.key} control={
                            <Checkbox
                                data-testid="rule-input"
                                name={option.key}
                                checked={state.options.includes(option.key)}
                                onChange={x => {
                                    if (x.target.checked) {
                                        state.setOptions([...state.options, option.key])
                                    } else {
                                        state.setOptions(state.options.filter(el => el !== option.key))
                                    }
                                }}
                            />
                        }/>
                    )}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button data-testid="cancel-button"
                        variant="contained" color="error"
                        onClick={onClose}>Cancel</Button>
                <Button data-testid="create-button"
                        variant="contained" color="success"
                        onClick={submit}>Create</Button>
            </DialogActions>
        </Dialog>
    )

}