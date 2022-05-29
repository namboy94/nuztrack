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
import {createRun} from "../../api/runs/runsApi";
import {CreateNuzlockeRunTO, NuzlockeRunTO} from "../../api/runs/runsTransfer";
import {RulesDetails} from "../../api/rules/rulesTransfer";
import {GamesListTO} from "../../api/games/gamesTransfer";
import {Severity} from "../../components/Snackbar";

export interface CreateNewRunDialogProps {
    open: boolean;
    onClose: () => void;
    setRunId: (id: number) => void;
    selectRun: (run: NuzlockeRunTO) => void;
    addRun: (run: NuzlockeRunTO) => void;
    displaySnack: (message: string, severity: Severity) => void
    rules: RulesDetails
    games: GamesListTO
}

export default function CreateNewRunDialog(props: CreateNewRunDialogProps) {

    const [name, setName] = useState("")
    const [game, setGame] = useState("")
    const [selectedRules, setSelectedRules] = useState(props.rules.defaultRules)
    const [submitting, setSubmitting] = useState(false)

    const ruleKeys: string[] = Array.from(props.rules.rules.keys());

    const createNewRun = () => {
        if (!submitting) {
            setSubmitting(true)
            const creator: CreateNuzlockeRunTO = {name: name, game: game, rules: selectedRules}
            createRun(creator).then(result => {
                props.addRun(result);
                onClose();
            }, error => {
                props.displaySnack(error.toString(), "error");
                enableSubmission()
            })
        }
    }

    const enableSubmission = () => {
        new Promise(x => setTimeout(x, 1000)).then(() => setSubmitting(false))
    }

    const handleRuleSelection = (key: string, newState: boolean) => {
        if (selectedRules.includes(key) && !newState) {
            setSelectedRules(previous => previous.filter(x => x !== key))
        }
        if (!selectedRules.includes(key) && newState) {
            setSelectedRules(previous => [...previous, key])
        }
    }

    const onClose = () => {
        setName("")
        setGame("")
        setSelectedRules(props.rules.defaultRules)
        enableSubmission()
        props.onClose()
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
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
                    {props.games.games.map((x: string) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
                </Select>
                <FormGroup>
                    {ruleKeys.map(key =>
                        <FormControlLabel key={key} control={
                            <Checkbox
                                name={key}
                                checked={selectedRules.includes(key)}
                                value={selectedRules.includes(key)}
                                onChange={x => handleRuleSelection(key, x.target.checked)}/>
                        } label={props.rules.rules.get(key)}/>
                    )}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={createNewRun}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}