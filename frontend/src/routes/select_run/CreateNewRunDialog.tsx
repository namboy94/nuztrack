import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import React, {useState} from "react";
import ErrorSnackbar from "../generic/ErrorSnackbar";
import {createRun} from "../../api/runs/runsApi";
import {useQuery} from "react-query";
import {loadGames} from "../../api/games/gamesApi";
import {loadRules} from "../../api/rules/rulesApi";
import {performLoadingCheck} from "../../util/loading";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";

export interface CreateNewRunDialogProps {
    open: boolean;
    onClose: () => void;
    setRunId: (id: number) => void;
    selectRun: (id: number) => void;
    addRun: (run: NuzlockeRunTO) => void;
}

export default function CreateNewRunDialog(props: CreateNewRunDialogProps) {
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [name, setName] = useState("")
    const [game, setGame] = useState("")
    const [selectedRules, setSelectedRules] = useState([""])
    const [rulesAreInitialized, setRulesAreInitialized] = useState(false)

    const games = useQuery("games", loadGames)
    const rules = useQuery("rules", loadRules)

    const loadCheck = performLoadingCheck([games, rules])
    if (loadCheck !== null) {
        return loadCheck
    }

    if (!rulesAreInitialized) {
        setRulesAreInitialized(true)
        setSelectedRules(rules.data!.defaultRules)
    }
    const ruleKeys: string[] = Array.from(rules.data!.rules.keys());

    const createNewRun = () => {
        createRun(name, game, selectedRules).then(result => {
            props.selectRun(result.id);
            props.addRun(result);
            props.onClose();
        }, error => showError(error.toString()))
    }

    const showError = (message: string) => {
        setErrorOpen(true)
        setErrorMessage(message)
    }

    const handleClose = () => {
        setErrorOpen(false)
        props.onClose()
    }

    const handleRuleSelection = (key: string, newState: boolean) => {
        if (selectedRules.includes(key) && !newState) {
            setSelectedRules(previous => previous.filter(x => x !== key))
        }
        if (!selectedRules.includes(key) && newState) {
            setSelectedRules(previous => [...previous, key])
        }
    }

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Create Run</DialogTitle>
            <DialogContent>
                <InputLabel>Name</InputLabel>
                <TextField
                    onChange={(x) => setName(x.target.value)}
                    autoFocus margin="dense" fullWidth variant="standard"
                    id="name" type="text" required

                />
                <InputLabel>Game</InputLabel>
                <Select fullWidth value={game} onChange={x => setGame(x.target.value)}>
                    {games.data!.games.map((x: string) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
                </Select>
                <FormGroup>
                    {ruleKeys.map(key =>
                        <FormControlLabel key={key} control={
                            <Checkbox
                                name={key}
                                checked={selectedRules.includes(key)}
                                value={selectedRules.includes(key)}
                                onChange={x => handleRuleSelection(key, x.target.checked)}/>
                        } label={rules.data!.rules.get(key)}/>
                    )}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createNewRun}>Create</Button>
            </DialogActions>
            <ErrorSnackbar open={errorOpen} setOpen={setErrorOpen} message={errorMessage}/>
        </Dialog>
    )
}