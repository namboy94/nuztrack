import {Button} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import CreateNewRunDialog from "./CreateNewRunDialog";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";
import DeleteRunDialog from "./DeleteRunDialog";
import {RunsList} from "./RunsList";
import {RulesDetails} from "../../api/rules/rulesTransfer";
import {GamesList} from "../../api/games/gamesTransfer";
import {Severity} from "../../components/Snackbar";
import {useNavigate} from "react-router";
import {useInvalidateRunsQuery} from "../../api/runs/runsQuery";

export interface RunSelectorProps {
    setRunId: (id: number) => void
    run: NuzlockeRunTO | null
    displaySnack: (message: string, severity: Severity) => void
    runs: NuzlockeRunTO[]
    rules: RulesDetails
    games: GamesList
}

export function RunSelector(props: RunSelectorProps) {

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [runToDelete, setRunToDelete] = useState<NuzlockeRunTO | null>(null)
    const [displayedRuns, setDisplayedRuns] = useState<NuzlockeRunTO[]>(props.runs)

    const invalidate = useInvalidateRunsQuery()
    const navigate = useNavigate()

    const selectRun = (run: NuzlockeRunTO) => {
        props.setRunId(run.id)
        localStorage.setItem("runId", `${run.id}`)
        navigate("/overview")
    }

    const removeRun = (run: NuzlockeRunTO) => {
        invalidate().then(() => {
            setDisplayedRuns(displayedRuns.filter(x => x.id !== run.id));
            if (props.run !== null && run.id === props.run.id) {
                props.setRunId(-1)
            }
        })
    }

    const addRun = (run: NuzlockeRunTO) => {
        invalidate().then(() => setDisplayedRuns([...displayedRuns, run]))
    }

    const openRemoveDialog = (run: NuzlockeRunTO) => {
        setRunToDelete(run)
        setDeleteDialogOpen(true)
    }

    return (
        <>
            <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>Create</Button>
            <RunsList displayedRuns={displayedRuns} selectRun={selectRun} openRemoveDialog={openRemoveDialog}/>
            <CreateNewRunDialog rules={props.rules}
                                games={props.games}
                                selectRun={selectRun}
                                setRunId={props.setRunId}
                                addRun={addRun}
                                displaySnack={props.displaySnack}
                                open={createDialogOpen}
                                onClose={() => setCreateDialogOpen(false)}/>
            <DeleteRunDialog runToDelete={runToDelete}
                             removeRun={removeRun}
                             open={deleteDialogOpen}
                             onClose={() => setDeleteDialogOpen(false)}/>
        </>
    )
}
