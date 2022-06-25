import {RunRouteProps} from "../common/RouteProps";
import {useOverviewDataLoader} from "./hooks/Overview.data";
import {useMilestoneListProps} from "./hooks/MilestoneList.hooks";
import {MilestoneList} from "./components/MilestoneList";
import {Divider, Typography} from "@mui/material";
import {TeamMemberGrid} from "../team/components/TeamMemberGrid";
import {usePokemonGridProps} from "../team/hooks/TeamMemberGrid.hooks";
import {TeamState} from "../../data/team/team.model";
import {LoadingIndicator} from "../common/components/LoadingIndicator";

export function OverviewRoute(props: RunRouteProps) {
    const {run, notify} = props

    const loading = useOverviewDataLoader(run)

    const milestoneListProps = useMilestoneListProps(run, notify)
    const activePokemonGridProps = usePokemonGridProps(run, notify, TeamState.ACTIVE)
    activePokemonGridProps.state = TeamState.DEAD // TODO Make this less hacky

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
        </>
    )
}