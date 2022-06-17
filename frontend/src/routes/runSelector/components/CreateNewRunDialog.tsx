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
import {RulesDetails} from "../../../data/rules/rules.model";
import {Game} from "../../../data/games/games.model";

export interface CreateNewRunDialogProps {
    open: boolean
    onClose: () => void
    games: Game[] | undefined
    rulesDetails: RulesDetails | undefined
    state: CreateNewRunDialogState
    submit: () => void
}

export interface CreateNewRunDialogState {
    game: Game,
    setGame: (game: Game) => void,
    name: string,
    setName: (name: string) => void,
    rules: string[],
    setRules: (rules: string[]) => void,
    customRules: string[],
    setCustomRules: (customRules: string[]) => void,
    reset: () => void
}

export function CreateNewRunDialog(props: CreateNewRunDialogProps) {

    const {open, onClose, games, rulesDetails, state, submit} = props

    if (games === undefined || rulesDetails === undefined) {
        return <></>
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Run</DialogTitle>
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
                            value={state.name}
                            onChange={x => state.setName(x.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            data-testid="game-input"
                            sx={{width: 200}}
                            options={games}
                            value={state.game}
                            disableClearable
                            getOptionLabel={game => game.title}
                            onChange={(_, newGame) => state.setGame(newGame)}
                            renderInput={(params) =>
                                <TextField label="Game" margin="dense" variant={"outlined"} {...params}/>}
                        />
                    </Grid>
                </Grid>
                <h3>Rules</h3>
                <FormGroup>
                    {Array.from(rulesDetails.rules.keys()).map(key =>
                        <FormControlLabel label={rulesDetails.rules.get(key)} key={key} control={
                            <Checkbox
                                data-testid="rule-input"
                                name={key}
                                checked={state.rules.includes(key)}
                                onChange={x => {
                                    if (x.target.checked) {
                                        state.setRules([...state.rules, key])
                                    } else {
                                        state.setRules(state.rules.filter(el => el !== key))
                                    }
                                }}
                            />}/>
                    )}
                </FormGroup>
                <TextField
                    data-testid="custom-rules-input"
                    onChange={(x) => state.setCustomRules(x.target.value.split("\n"))}
                    fullWidth
                    value={state.customRules.join("\n")}
                    margin="dense"
                    variant="filled"
                    multiline
                    id="custom-rules"
                    type="text"
                    label="Custom Rules"
                />
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