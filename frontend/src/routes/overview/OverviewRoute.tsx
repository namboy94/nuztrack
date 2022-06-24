import {RunRouteProps} from "../common/RouteProps";
import {useOverviewDataLoader} from "./hooks/Overview.data";
import {useMilestoneListProps} from "./hooks/MilestoneList.hooks";
import {MilestoneList} from "./components/MilestoneList";
import {Divider, Typography} from "@mui/material";

export function OverviewRoute(props: RunRouteProps) {
    const {run, notify} = props
    const milestoneListProps = useMilestoneListProps(run, notify)

    const loading = useOverviewDataLoader(run)

    return (
        <>
            <Typography variant="subtitle1" component="h4">{run.name}</Typography>
            <Divider/>
            <Typography variant="subtitle2" component="h5">Milestones</Typography>
            <MilestoneList {...milestoneListProps}/>
        </>
    )
}