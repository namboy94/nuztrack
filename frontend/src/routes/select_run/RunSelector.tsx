import {Button} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import CreateNewRunDialog from "./CreateNewRunDialog";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import DeleteRunDialog from "./DeleteRunDialog";
import {RunsList} from "./RunsList";
import {RulesDetails} from "../../api/rules/rulesTypes";
import {GamesList} from "../../api/games/gamesTypes";
import {Severity} from "../../components/Snackbar";
import {useNavigate} from "react-router";
import {useInvalidateRunsQuery} from "../../api/runs/runsQuery";

export interface RunSelectorProps {
    setRunId: (id: number) => void
    run: NuzlockeRun | null
    displaySnack: (message: string, severity: Severity) => void
    runs: NuzlockeRun[]
    rules: RulesDetails
    games: GamesList
}

export function RunSelector(props: RunSelectorProps) {

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [runToDelete, setRunToDelete] = useState<NuzlockeRun | null>(null)
    const [displayedRuns, setDisplayedRuns] = useState<NuzlockeRun[]>(props.runs)

    const invalidate = useInvalidateRunsQuery()
    const navigate = useNavigate()

    const selectRun = (run: NuzlockeRun) => {
        props.setRunId(run.id)
        localStorage.setItem("runId", `${run.id}`)
        navigate("/overview")
        props.displaySnack(`Selected Run ${run.name}`, "info")
    }

    const removeRun = (run: NuzlockeRun) => {
        invalidate().then(() => {
            setDisplayedRuns(displayedRuns.filter(x => x.id !== run.id));
            if (props.run !== null && run.id === props.run.id) {
                props.setRunId(-1)
            }
        })
    }

    const addRun = (run: NuzlockeRun) => {
        invalidate().then(() => setDisplayedRuns([...displayedRuns, run]))
    }

    const openRemoveDialog = (run: NuzlockeRun) => {
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
                             displaySnack={props.displaySnack}
                             onClose={() => setDeleteDialogOpen(false)}/>
        </>
    )
}
