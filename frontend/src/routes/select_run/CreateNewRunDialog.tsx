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
import {CreateNuzlockeRun, NuzlockeRun} from "../../api/runs/runsTypes";
import {RulesDetails} from "../../api/rules/rulesTypes";
import {GamesList} from "../../api/games/gamesTypes";
import {Severity} from "../../components/Snackbar";

export interface CreateNewRunDialogProps {
    open: boolean;
    onClose: () => void;
    setRunId: (id: number) => void;
    selectRun: (run: NuzlockeRun) => void;
    addRun: (run: NuzlockeRun) => void;
    displaySnack: (message: string, severity: Severity) => void
    rules: RulesDetails
    games: GamesList
}

export default function CreateNewRunDialog(props: CreateNewRunDialogProps) {

    const [name, setName] = useState("")
    const [game, setGame] = useState("")
    const [selectedRules, setSelectedRules] = useState(props.rules.defaultRules)
    const [customRules, setCustomRules] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)

    const ruleKeys: string[] = Array.from(props.rules.rules.keys());
    const gameKeys: string[] = Array.from(props.games.keys());

    const createNewRun = () => {
        if (!submitting) {
            setSubmitting(true)
            const creator: CreateNuzlockeRun = {name: name, game: game, rules: selectedRules, customRules: customRules}
            createRun(creator).then(result => {
                props.addRun(result);
                onClose();
                props.displaySnack(`Run ${result.name} created successfully`, "success")
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
                <Select label="Game" fullWidth value={game} onChange={x => setGame(x.target.value)}>
                    {gameKeys.map((key: string) =>
                        <MenuItem value={key} key={key}>{props.games.get(key)}</MenuItem>)
                    }
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
                <TextField
                    onChange={(x) =>
                        setCustomRules(x.target.value.split("\n").filter(x => !!x))
                    }
                    autoFocus margin="dense" fullWidth variant="standard" multiline
                    id="custom-rules" type="text" label="Custom Rules"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={createNewRun}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}