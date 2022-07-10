import {RunRouteProps} from "../common/RouteProps";
import {useOverviewDataLoader} from "./hooks/Overview.data";
import {useMilestoneListProps} from "./hooks/MilestoneList.hooks";
import {MilestoneList} from "./components/MilestoneList";
import {Button, Divider, Typography} from "@mui/material";
import {TeamMemberGrid} from "../team/components/TeamMemberGrid";
import {usePokemonGridProps} from "../team/hooks/TeamMemberGrid.hooks";
import {TeamState} from "../../data/team/team.model";
import {LoadingIndicator} from "../common/components/LoadingIndicator";
import {useNextGameDialogProps} from "./hooks/NextGameDialog.hooks";
import {NextGameDialog} from "./components/NextGameDialog";
import axios from "axios-observable";

export function OverviewRoute(props: RunRouteProps) {
    const {run, notify} = props

    const loading = useOverviewDataLoader(run)

    const milestoneListProps = useMilestoneListProps(run, notify)
    const activePokemonGridProps = usePokemonGridProps(run, notify, TeamState.ACTIVE)
    activePokemonGridProps.state = TeamState.DEAD // TODO Make this less hacky

    const [openNextGameDialog, nextGameDialogProps] = useNextGameDialogProps(run, notify)

    if (loading) {
        return <LoadingIndicator/>
    }

    return (
        <>
            <Typography variant="subtitle1" component="h4">{run.name}</Typography>
            <Divider/>
            <Typography variant="subtitle2" component="h5">Milestones</Typography>
            <MilestoneList {...milestoneListProps}/>
            <Divider/>
            <Typography variant="subtitle2" component="h5">Current Party</Typography>
            <TeamMemberGrid {...activePokemonGridProps}/>
            <Divider/>
            <Button
                onClick={openNextGameDialog}
                variant="contained"
            >Next Game</Button>
            <Button
                onClick={() => exportRun(run.id)}
                variant="contained"
            >Export</Button>
            <Button
                onClick={() => uploadSave(run.id)}
                variant="contained"
            >Upload Save</Button>
            <NextGameDialog {...nextGameDialogProps}/>
        </>
    )
}

function exportRun(runId: number) {
    // TODO Don't do this quick and dirty
    axios.get(`/api/export/${runId}`).subscribe({
        next: result => {
            const a = document.createElement("a")
            const file = new Blob([JSON.stringify(result.data)])
            a.href = URL.createObjectURL(file)
            a.download = "export.json"
            a.click()
        }
    })
}

function uploadSave(runId: number) {
    const input = document.createElement("input")
    input.type = "file"

    input.onchange = e => {
        console.log(JSON.stringify(e))
        console.log(input.files!![0])

        const formData = new FormData()
        formData.append("file", input.files!![0])
        axios.post(`/api/runs/${runId}/savefile`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        }).subscribe({
            error: e => console.log(JSON.stringify(e)),
            complete: () => console.log("Complete")
        })
    }
    input.click()
}