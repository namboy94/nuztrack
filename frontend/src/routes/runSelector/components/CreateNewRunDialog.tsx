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
import {GameList} from "../../../data/games/games.model";

export interface CreateNewRunDialogProps {
    open: boolean
    onClose: () => void
    gameList: GameList | undefined
    rulesDetails: RulesDetails | undefined
    state: CreateNewRunDialogState
    submit: () => void
}

export interface CreateNewRunDialogState {
    game: string,
    setGame: (game: string) => void,
    name: string,
    setName: (name: string) => void,
    rules: string[],
    setRules: (rules: string[]) => void,
    customRules: string[],
    setCustomRules: (customRules: string[]) => void,
    reset: () => void
}

export function CreateNewRunDialog(props: CreateNewRunDialogProps) {

    const {open, onClose, gameList, rulesDetails, state, submit} = props

    if (gameList === undefined || rulesDetails === undefined) {
        return <h1>LOADING</h1>
    }

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
                            label="Run Name"
                            onChange={x => state.setName(x.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            sx={{width: 200}}
                            options={Array.from(gameList.keys())}
                            value={state.game}
                            disableClearable
                            getOptionLabel={x => gameList.get(x)!!}
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
                    onChange={(x) => state.setCustomRules(x.target.value.split("\n"))}
                    fullWidth
                    margin="dense"
                    variant="filled"
                    multiline
                    id="custom-rules"
                    type="text"
                    label="Custom Rules"
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error"
                        onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="success"
                        onClick={submit}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}