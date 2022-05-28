import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {useNavigate} from "react-router";
import CreateNewRunDialog from "./CreateNewRunDialog";
import {useQuery} from "react-query";
import {loadRuns} from "../../api/runs/runsApi";
import {performLoadingCheck} from "../../util/loading";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";
import DeleteRunDialog from "./DeleteRunDialog";

export interface RunSelectorProps {
    setRunId: (id: number) => void
}

export function RunSelector(props: RunSelectorProps) {

    const navigate = useNavigate()

    const [displayedRuns, setDisplayedRuns] = useState<NuzlockeRunTO[]>([])
    const [initialized, setInitialized] = useState(false)

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [runToDelete, setRunToDelete] = useState<NuzlockeRunTO | null>(null)


    const runData = useQuery("runs", loadRuns)


    const loadCheck = performLoadingCheck([runData])
    if (loadCheck !== null) {
        return loadCheck
    }

    if (!initialized) {
        setDisplayedRuns(runData.data!.map(x => x))
        setInitialized(true)
    }

    const selectRun = (id: number) => {
        props.setRunId(id)
        localStorage.setItem("runId", `${id}`)
        navigate("/overview")
    }

    const openRemoveDialog = (run: NuzlockeRunTO) => {
        setRunToDelete(run)
        setDeleteDialogOpen(true)
    }

    return (
        <>
            <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>Create</Button>
            <Grid container spacing={2} id="runs">
                {displayedRuns.map((run) =>
                    <Grid item xs={4} key={run.name + run.game}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {run.name} ({run.game})
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" onClick={() => selectRun(run.id)}>Select</Button>
                                <Button variant="contained" onClick={() => openRemoveDialog(run)}>Delete</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>
            <CreateNewRunDialog selectRun={selectRun} setRunId={props.setRunId} open={createDialogOpen}
                                onClose={() => setCreateDialogOpen(false)}/>
            <DeleteRunDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}
                             runToDelete={runToDelete} setDisplayedRuns={setDisplayedRuns}/>
        </>
    )
}
